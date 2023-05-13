using FluentAssertions;
using Moq;
using NUnit.Framework;
using ShariahStandards.org.DatabaseModel;

namespace ShariahStandards.org.UnitTests.Services.OneTimePasscodeServiceTests;
public class BuildNewOneTimePasscode:OneTimePasscodeServiceBaseTest{
    private string arg_email=null!;
    private OneTimePasscode result=null!;

    private void WhenMethodIsCalled(){
        result = service.BuildNewOneTimePasscode(arg_email);
    }
    private void GivenRealMethodIsCalled(){
        base.GivenServiceIsSetup();
        serviceMock.Setup(x=>x.BuildNewOneTimePasscode(It.IsAny<string>())).CallBase();
    }
    private void GivenArgumentsAreSet(){
        GivenRealMethodIsCalled();
        arg_email=faker.Internet.Email();
    }
    [Test]
    public void ShouldSetTheEmail(){
        GivenArgumentsAreSet();
        WhenMethodIsCalled();
        result.Email.Should().Be(arg_email);
    }
}