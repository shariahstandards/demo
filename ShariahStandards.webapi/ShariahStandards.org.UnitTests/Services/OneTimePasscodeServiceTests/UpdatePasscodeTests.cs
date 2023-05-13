using Moq;
using NUnit.Framework;
using ShariahStandards.org.DatabaseModel;

namespace ShariahStandards.org.UnitTests.Services.OneTimePasscodeServiceTests;

public class UpdatePasscodeTests:OneTimePasscodeServiceBaseTest{
    private OneTimePasscode arg_oneTimePasscode=null!;

    private void WhenMethodIsCalled(){
        service.UpdatePasscode(arg_oneTimePasscode);
    }
    private void GivenTestMethodIsNotMocked(){
        base.GivenServiceIsSetup();
        serviceMock.Setup(x=>x.UpdatePasscode(It.IsAny<OneTimePasscode>())).CallBase();
    }
    private void GivenArgumentsAreSetup(){
        GivenTestMethodIsNotMocked();
        arg_oneTimePasscode=fakeOneTimePasscode.Generate();
    }
    [Test]
    public void ShouldSetANewPassCode(){
        GivenArgumentsAreSetup();
        WhenMethodIsCalled();
        serviceMock.Verify(x=>x.SetNewPasscode(arg_oneTimePasscode),Times.Once);
    }
    [Test] 
    public void ShouldSaveTheChanges(){
        GivenArgumentsAreSetup();
        WhenMethodIsCalled();
        applicationDbContextMock.Verify(x=>x.SaveChanges(),Times.Once);
    }
    [Test]
    public void ShouldSendTheEmail(){
        GivenArgumentsAreSetup();
        WhenMethodIsCalled();
        serviceMock.Verify(x=>x.SendCodeInEmail(arg_oneTimePasscode),Times.Once);
    }
}