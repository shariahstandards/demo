using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using MimeKit;
using ShariahStandards.org.DatabaseModel;
using ShariahStandards.org.Resources;

namespace ShariahStandards.org.Services;
public interface IOneTimePasscodeService
{
    LoginResult LoginWithOneTimePasscode(LoginWithOneTimePasscodeRequest request);
    void SendOneTimePasscode(string email);
}

public class OneTimePasscodeService : IOneTimePasscodeService
{
    private readonly IApplicationDbContext _dbContext;
    private readonly ICommonValidationService _commonValidationService;
    private readonly ISmtpClient _smtpClient;
    private readonly IConfiguration _configuration;
    private readonly ITokenService _tokenService;

    public OneTimePasscodeService(
        IApplicationDbContext dbContext,
        ICommonValidationService commonValidationService,
        ISmtpClient smtpClient,
        IConfiguration configuration,
        ITokenService tokenService
        )
    {
        _dbContext = dbContext;
        _commonValidationService = commonValidationService;
        _smtpClient = smtpClient;
        _configuration = configuration;
        _tokenService = tokenService;
    }

    public virtual OneTimePasscode BuildNewOneTimePasscode(string email)
    {
        return new OneTimePasscode{
            Email=email,
            Passcode=string.Empty
        };
    }

    public virtual void SaveNewOneTimePasscode(string email)
    {
        var otp=BuildNewOneTimePasscode(email);
        SetNewPasscode(otp);
        _dbContext.Add(otp);
        _dbContext.SaveChanges();
        SendCodeInEmail(otp).Wait();
    }

    public void SendOneTimePasscode(string email)
    {
        _commonValidationService.ValidateEmail(email);
        var existingPasscode = _dbContext.Set<OneTimePasscode>().SingleOrDefault(x=>x.Email==email);
        if(existingPasscode==null){
            SaveNewOneTimePasscode(email);
        }else{
            UpdatePasscode(existingPasscode);
        }
    }
    static Random _random=new Random();
    public virtual void SetNewPasscode(OneTimePasscode oneTimePasscode)
    {
        oneTimePasscode.UtcExpiryDateTime=DateTime.UtcNow.AddMinutes(15);
        oneTimePasscode.UtcConfirmedDateTime=null;
        oneTimePasscode.UtcCreatedDateTime=DateTime.UtcNow;
        var validChars=Enumerable.Range(0,10).Select(x=>x.ToString());
        oneTimePasscode.Passcode = string.Concat(Enumerable.Range(0,7).Select(_=>_random.Next(0,9).ToString()));
    }

    public virtual void UpdatePasscode(OneTimePasscode oneTimePasscode)
    {
        SetNewPasscode(oneTimePasscode);
        _dbContext.SaveChanges();
        SendCodeInEmail(oneTimePasscode).Wait();
    }

    public virtual async Task SendCodeInEmail(OneTimePasscode oneTimePasscode)
    {
        var message=BuildEmailMessage(oneTimePasscode);

        _smtpClient.Connect("mail.shariahstandards.org",465,true);
        _smtpClient.Authenticate("no-reply@shariahstandards.org", _configuration["ShariahStandardsDotOrgEmailPassword"]);
        var sendResult = await _smtpClient.SendAsync(message);
        _smtpClient.Disconnect (true);
    }

    public virtual MimeMessage BuildEmailMessage(OneTimePasscode oneTimePasscode)
    {
        var message=new MimeMessage();
        message.To.Add(new MailboxAddress("",oneTimePasscode.Email));
        message.From.Add(new MailboxAddress("ShariahStandards.org","no-reply@shariahstandards.org"));
        message.Subject="ShariahStandards.org One Time Passcode";
        var bodyBuilder=new BodyBuilder();
        bodyBuilder.TextBody="Your one time passcode is "+oneTimePasscode.Passcode+"\n";
        message.Body = bodyBuilder.ToMessageBody();
        return message;
    }

    public LoginResult LoginWithOneTimePasscode(LoginWithOneTimePasscodeRequest request)
    {
        var otp=_dbContext.Set<OneTimePasscode>().SingleOrDefault(x=>
            x.Email==request.Email
            && x.Passcode==request.Passcode
            && x.UtcExpiryDateTime>DateTime.UtcNow);
        if(otp==null){
            return new LoginResult(false,string.Empty);
        }
        return new LoginResult(true,_tokenService.BuildNewJsonWebToken(otp));
    }

    
}
