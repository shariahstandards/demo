using Microsoft.AspNetCore.Mvc;
using ShariahStandards.org.Resources;
using ShariahStandards.org.Services;

namespace ShariahStandards.org.WebApi;
public class LoginController:ControllerBase{
    private readonly IOneTimePasscodeService _oneTimePassCodeService;

    public LoginController(IOneTimePasscodeService oneTimePassCodeService)
    {
        _oneTimePassCodeService = oneTimePassCodeService;
    }
    [HttpPost]
    [Route("SendOneTimePasscode")]
    public SimplePostResult SendOneTimePasscode([FromBody] SendOTPRequest request){
        _oneTimePassCodeService.SendOneTimePasscode(request.Email);
        return new SimplePostResult(true);
    }
    [HttpPost]
    [Route("LoginWithOneTimePasscode")]
    public LoginResult LoginWithOneTimePasscode([FromBody] LoginWithOneTimePasscodeRequest request){
        return _oneTimePassCodeService.LoginWithOneTimePasscode(request);
    }  

}