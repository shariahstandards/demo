using Moq;
using Bogus;
using ShariahStandards.org.Services;
using ShariahStandards.org.DatabaseModel;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;

namespace ShariahStandards.org.UnitTests.Services.OneTimePasscodeServiceTests;

public abstract class OneTimePasscodeServiceBaseTest
{
    public OneTimePasscodeServiceBaseTest()
    {
        this.smtpClientMock=null!;
        this.configurationMock=null!;
        Randomizer.Seed = new Random(12345678);
        faker = new Faker();
        fakeOneTimePasscode=new Faker<OneTimePasscode>()
        .RuleFor(x=>x.Email,f=>f.Internet.Email())
        .RuleFor(x=>x.Id,f=>f.Random.Number(1000,1000000))
        .RuleFor(x=>x.Passcode,f=>f.Random.AlphaNumeric(7))
        .RuleFor(x=>x.UtcExpiryDateTime,f=>f.Date.Between(DateTime.UtcNow.AddMinutes(1),DateTime.UtcNow.AddMinutes(10)))
        .RuleFor(x=>x.UtcCreatedDateTime,f=>f.Date.Past())
        .RuleFor(x=>x.UtcConfirmedDateTime,f=>null);
    }

    protected Mock<ICommonValidationService> commonValidationServiceMock=null!;
    protected Mock<ISmtpClient> smtpClientMock;
    protected Mock<IConfiguration> configurationMock;
    protected Mock<IApplicationDbContext> applicationDbContextMock=null!;
    protected Mock<OneTimePasscodeService> serviceMock = null!;
    protected OneTimePasscodeService service = null!;
    protected Faker faker;
    protected Faker<OneTimePasscode> fakeOneTimePasscode;

    protected void GivenServiceIsSetup()
    {
        applicationDbContextMock = new Mock<IApplicationDbContext>();
        commonValidationServiceMock = new Mock<ICommonValidationService>();
        smtpClientMock=new Mock<ISmtpClient>();
        configurationMock=new Mock<IConfiguration>();

        serviceMock = new Mock<OneTimePasscodeService>(
            applicationDbContextMock.Object,
            commonValidationServiceMock.Object,
            smtpClientMock.Object,
            configurationMock.Object
        );
        service = serviceMock.Object;
    }
}
