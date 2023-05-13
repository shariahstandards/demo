using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using FluentAssertions;
using Microsoft.IdentityModel.Tokens;
using Moq;
using NUnit.Framework;
using ShariahStandards.org.DatabaseModel;

namespace ShariahStandards.org.UnitTests.Services.TokenServiceTests;

public class BuildNewJsonWebTokenTests : TokenServiceBaseTest
{

    public BuildNewJsonWebTokenTests()
    {
        arg_oneTimePasscode = null!;
    }
    private OneTimePasscode arg_oneTimePasscode;
    private string result=null!;

    private void WhenMethodIsCalled()
    {
        result = service.BuildNewJsonWebToken(arg_oneTimePasscode);
    }
    private void GivenTestedMethodIsNotMocked()
    {
        base.GivenServiceIsSetup();
        serviceMock.Setup(x => x.BuildNewJsonWebToken(It.IsAny<OneTimePasscode>())).CallBase();
    }
    private void GivenArgumentsAreSet()
    {
        GivenTestedMethodIsNotMocked();
        arg_oneTimePasscode = new OneTimePasscode
        {
            Email = faker.Internet.Email(),
            Passcode = string.Concat(faker.Random.Digits(7))
        };
    }
    [Test]
    public void ShouldReturnATokenWithTheEmailAsTheUserName(){
        GivenArgumentsAreSet();
        WhenMethodIsCalled();
        var tokenHandler = new JwtSecurityTokenHandler();
        var claimsPrincipal = tokenHandler.ValidateToken(result, tokenValidationParameters, out SecurityToken validatedToken);
        claimsPrincipal.Claims.Any(x=>x.Type==ClaimTypes.Name).Should().BeTrue();
        claimsPrincipal.Claims.Single(x=>x.Type==ClaimTypes.Name).Value.Should().Be(arg_oneTimePasscode.Email);
    }
}