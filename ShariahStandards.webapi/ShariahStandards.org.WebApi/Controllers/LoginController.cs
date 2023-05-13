using Microsoft.AspNetCore.Mvc;
using ShariahStandards.org.Resources;
using ShariahStandards.org.Services;

namespace ShariahStandards.org.WebApi;
public class LoginController:ControllerBase{
    private readonly IOneTimePasscodeService _oneTimePassCodeService;
    private readonly ILogger<LoginController> _logger;

    public LoginController(IOneTimePasscodeService oneTimePassCodeService,ILogger<LoginController> logger)
    {
        _oneTimePassCodeService = oneTimePassCodeService;
        _logger = logger;
    }
    [HttpPost]
    [Route("SendOneTimePasscode")]
    public SimplePostResult SendOneTimePasscode([FromBody] SendOTPRequest request){
        _oneTimePassCodeService.SendOneTimePasscode(request.Email);
        return new SimplePostResult(true);
        // }
        // catch(Exception ex){
        //     _logger.Log(LogLevel.Critical,ex,"Unable to send one time passcode");
        //     return new SimplePostResult(false);
        // }
    }
}