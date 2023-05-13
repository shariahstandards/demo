using Moq;
using NUnit.Framework;
using ShariahStandards.org.DatabaseModel;

namespace ShariahStandards.org.UnitTests.Services.OneTimePasscodeServiceTests;
public class SaveNewOneTimePasscodeTests:OneTimePasscodeServiceBaseTest{
    private string arg_email=null!;
    private OneTimePasscode builtNewOneTimePasscode=null!;

    public void WhenMethodIsCalled(){
        service.SaveNewOneTimePasscode(arg_email);
    }
    private void GivenTestMethodIsNotMocked(){
        base.GivenServiceIsSetup();
        serviceMock.Setup(x=>x.SaveNewOneTimePasscode(It.IsAny<string>())).CallBase();
    }
    private void GivenMethodArgumentsAreSetup(){
        GivenTestMethodIsNotMocked();
        arg_email=faker.Internet.Email();
    }
    private void GivenOneTimePasscodeIsBuilt(){
        GivenMethodArgumentsAreSetup();
        builtNewOneTimePasscode=fakeOneTimePasscode.Generate();
        serviceMock.Setup(x=>x.BuildNewOneTimePasscode(arg_email)).Returns(builtNewOneTimePasscode);
    }
    [Test]
    public void ShouldSetANewOneTimeCode(){
        GivenOneTimePasscodeIsBuilt();
        WhenMethodIsCalled();
        serviceMock.Verify(x=>x.SetNewPasscode(builtNewOneTimePasscode),Times.Once);
    }
    [Test]
    public void ShouldAddTheNewOneTimeCodeToTheDatabase(){
        GivenOneTimePasscodeIsBuilt();
        WhenMethodIsCalled();
        applicationDbContextMock.Verify(x=>x.Add(builtNewOneTimePasscode),Times.Once);
    }
    [Test]
    public void ShouldSaveDatabaseChanges(){
        GivenOneTimePasscodeIsBuilt();
        WhenMethodIsCalled();
        applicationDbContextMock.Verify(x=>x.SaveChanges(),Times.Once);
    }
    [Test]
    public void ShouldSendEmail(){
        GivenOneTimePasscodeIsBuilt();
        WhenMethodIsCalled();
        serviceMock.Verify(x=>x.SendCodeInEmail(builtNewOneTimePasscode),Times.Once);
    }
}