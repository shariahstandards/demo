using Bogus;
using FluentAssertions;
using Moq;
using NUnit.Framework;
using ShariahStandards.org.DatabaseModel;
using ShariahStandards.org.Resources;

namespace ShariahStandards.org.UnitTests.Services.OneTimePasscodeServiceTests;
public class LoginWithOneTimePasscodeTests:OneTimePasscodeServiceBaseTest{

    public LoginWithOneTimePasscodeTests(){
        fakeLoginRequest=new Faker<LoginWithOneTimePasscodeRequest>()
        .CustomInstantiator(f=>new LoginWithOneTimePasscodeRequest(
            f.Internet.Email(),string.Concat(f.Random.Digits(7))
        ));
        oneTimePasscodesThatDoNotMatch=null!;
        matchingOneTimePasscode=null!;
        oneTimePasscodesThatDoIncludeAMatch=null!;
        builtJsonWebToken=null!;
    }
    private LoginWithOneTimePasscodeRequest arg_loginRequest=null!;
    private LoginResult result=null!;
    private Faker<LoginWithOneTimePasscodeRequest> fakeLoginRequest;
    private IQueryable<OneTimePasscode> oneTimePasscodesThatDoNotMatch;
    private OneTimePasscode matchingOneTimePasscode;
    private IQueryable<OneTimePasscode> oneTimePasscodesThatDoIncludeAMatch;
    private string builtJsonWebToken;

    private void WhenMethodIsCalled(){
        result = service.LoginWithOneTimePasscode(arg_loginRequest);
    }
    private void GivenArgumentsAreSetup(){
        base.GivenServiceIsSetup();
        arg_loginRequest=fakeLoginRequest.Generate();
    }
    private OneTimePasscode GenerateWith(string email, string passcode,DateTime utcExpiryDateTime){
        var otp = fakeOneTimePasscode.Generate();
        otp.Email=email;
        otp.Passcode=passcode;
        otp.UtcExpiryDateTime=utcExpiryDateTime;
        return otp;
    }
    private void GivenNoValidOneTimePasswordIsFound(){
        GivenArgumentsAreSetup();
        oneTimePasscodesThatDoNotMatch=new List<OneTimePasscode>{
            GenerateWith(arg_loginRequest.Email+".co",arg_loginRequest.Passcode,DateTime.UtcNow.AddMinutes(3)),
            GenerateWith(arg_loginRequest.Email,arg_loginRequest.Passcode+"9",DateTime.UtcNow.AddMinutes(3)),
            GenerateWith(arg_loginRequest.Email,arg_loginRequest.Passcode,DateTime.UtcNow.AddMinutes(-3))
        }.AsQueryable();
        applicationDbContextMock.Setup(x=>x.Set<OneTimePasscode>()).Returns(oneTimePasscodesThatDoNotMatch);
    }
    [Test]
    public void NoValidOneTimePasscodeIsFound_ShouldReturnLoginFailure(){
        GivenNoValidOneTimePasswordIsFound();
        WhenMethodIsCalled();
        result.Success.Should().BeFalse();
    }
    private void GivenValidOneTimePasswordIsFound(){
        GivenArgumentsAreSetup();
        matchingOneTimePasscode = GenerateWith(arg_loginRequest.Email,arg_loginRequest.Passcode,DateTime.UtcNow.AddMinutes(1));
        oneTimePasscodesThatDoIncludeAMatch=new List<OneTimePasscode>{
            GenerateWith(arg_loginRequest.Email+".co",arg_loginRequest.Passcode,DateTime.UtcNow.AddMinutes(3)),
            GenerateWith(arg_loginRequest.Email,arg_loginRequest.Passcode+"9",DateTime.UtcNow.AddMinutes(3)),
            GenerateWith(arg_loginRequest.Email,arg_loginRequest.Passcode,DateTime.UtcNow.AddMinutes(-3)),
            matchingOneTimePasscode
        }.AsQueryable();
        applicationDbContextMock.Setup(x=>x.Set<OneTimePasscode>()).Returns(oneTimePasscodesThatDoIncludeAMatch);
    }
    private void GivenTokenServiceWorks(){
        GivenValidOneTimePasswordIsFound();
        builtJsonWebToken=faker.Random.AlphaNumeric(100);
        tokenServiceMock.Setup(x=>x.BuildNewJsonWebToken(matchingOneTimePasscode)).Returns(builtJsonWebToken);
    }
    [Test]
    public void ValidOneTimePasscodeIsFound_ShouldBuildSuccessResult(){
        GivenValidOneTimePasswordIsFound();
        WhenMethodIsCalled();
        result.Success.Should().BeTrue();
    }
    [Test]
    public void GivenTokenServiceWorks_ShouldReturnBuiltJsonWebToken(){
        GivenTokenServiceWorks();
        WhenMethodIsCalled();
        result.JWT.Should().Be(builtJsonWebToken);
    }
}