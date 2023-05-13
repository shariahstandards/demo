using Moq;
using NUnit.Framework;
using ShariahStandards.org.DatabaseModel;
using Microsoft.EntityFrameworkCore;
using FluentAssertions;
using System.Text.RegularExpressions;
using FluentAssertions.Execution;

namespace ShariahStandards.org.UnitTests.Services.OneTimePasscodeServiceTests;
public class SetNewPasscodeTests:OneTimePasscodeServiceBaseTest{
    private OneTimePasscode arg_oneTimePasscode=null!;
    private string initialPasscode=null!;

    private void WhenMethodIsCalled(){
        service.SetNewPasscode(arg_oneTimePasscode);
    }
    private void GivenTestMethodIsNotMocked(){
        base.GivenServiceIsSetup();
        serviceMock.Setup(x=>x.SetNewPasscode(It.IsAny<OneTimePasscode>())).CallBase();
    }
    private void GivenArgumentsAreSetup(){
        GivenTestMethodIsNotMocked();
        arg_oneTimePasscode=fakeOneTimePasscode.Generate();
        arg_oneTimePasscode.UtcConfirmedDateTime=faker.Date.Past();
        initialPasscode=arg_oneTimePasscode.Passcode;
    }
    [Test]
    public void ShouldSetExpiryDateTimeTo15MinutesFromNow(){
        GivenArgumentsAreSetup();
        WhenMethodIsCalled();
        arg_oneTimePasscode.UtcExpiryDateTime.Should().BeCloseTo(DateTime.UtcNow.AddMinutes(15),TimeSpan.FromSeconds(1));
    }
    [Test]
    public void ShouldSetConfirmationDateToNull(){
        GivenArgumentsAreSetup();
        WhenMethodIsCalled();
        arg_oneTimePasscode.UtcConfirmedDateTime.Should().BeNull();
    }
    [Test]
    public void ShouldSetCreatedDateTimeToNow(){
        GivenArgumentsAreSetup();
        WhenMethodIsCalled();
        arg_oneTimePasscode.UtcCreatedDateTime.Should().BeCloseTo(DateTime.UtcNow,TimeSpan.FromSeconds(1));
    }
    [Test]
    public void ShouldChangeThePasscode(){
        GivenArgumentsAreSetup();
        WhenMethodIsCalled();
        arg_oneTimePasscode.Passcode.Should().NotBe(initialPasscode);
    }
    [Test]
    public void ShouldSetThePasscodeToA7DigitString(){
        GivenArgumentsAreSetup();
        WhenMethodIsCalled();
        using var scope = new AssertionScope();
        arg_oneTimePasscode.Passcode.Length.Should().Be(7);
        var match =Regex.Match(arg_oneTimePasscode.Passcode,@"^\d{7}$");
        match.Success.Should().BeTrue();
    }
}