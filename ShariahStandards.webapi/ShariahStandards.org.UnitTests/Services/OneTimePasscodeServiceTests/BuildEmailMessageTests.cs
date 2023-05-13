using FluentAssertions;
using MimeKit;
using Moq;
using NUnit.Framework;
using ShariahStandards.org.DatabaseModel;

namespace ShariahStandards.org.UnitTests.Services.OneTimePasscodeServiceTests;

public class BuildEmailMessage:OneTimePasscodeServiceBaseTest{
    private OneTimePasscode arg_oneTimePasscode=null!;
    private MimeMessage result=null!;

    private void WhenMethodIsCalled(){
        result = service.BuildEmailMessage(arg_oneTimePasscode);
    }
    private void GivenTesMethodIsNotMocked(){
        base.GivenServiceIsSetup();
        serviceMock.Setup(x=>x.BuildEmailMessage(It.IsAny<OneTimePasscode>())).CallBase();
    }
    private void GivenArgumentsAreSet(){
        GivenTesMethodIsNotMocked();
        arg_oneTimePasscode=fakeOneTimePasscode.Generate();
    }
    [Test]
    public void ShouldSetTheSubjectCorrectly(){
        GivenArgumentsAreSet();
        WhenMethodIsCalled();
        result.Subject.Should().Be("ShariahStandards.org One Time Passcode");
    }
    [Test]
    public void ShouldSetTheFromAddressCorrectly(){
        GivenArgumentsAreSet();
        WhenMethodIsCalled();
        (result.From.First() as MailboxAddress)!.Address.ToString().Should().Be("no-reply@shariahstandards.org");
    }
    [Test]
    public void ShouldSetTheBodyToThePasscode(){
        GivenArgumentsAreSet();
        WhenMethodIsCalled();
        result.Body.ToString().Should().Contain("Your one time passcode is "+ arg_oneTimePasscode.Passcode);
    }
    [Test]
    public void ShouldSetTheRecipientCorrectly(){
        GivenArgumentsAreSet();
        WhenMethodIsCalled();
        (result.To.First()as MailboxAddress)!.Address.Should().Be(arg_oneTimePasscode.Email);
    }
}