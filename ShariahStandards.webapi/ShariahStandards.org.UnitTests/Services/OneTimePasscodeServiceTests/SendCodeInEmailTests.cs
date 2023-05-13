using Bogus;
using MimeKit;
using Moq;
using NUnit.Framework;
using ShariahStandards.org.DatabaseModel;

namespace ShariahStandards.org.UnitTests.Services.OneTimePasscodeServiceTests;

public class SendCodeInEmailTests:OneTimePasscodeServiceBaseTest{

    public SendCodeInEmailTests()
    {
        fakeMailMessage=new Faker<MimeMessage>();
        arg_oneTimePasscode=null!;
        builtMailMessage=null!;
        emailPassword=null!;
    }
    private OneTimePasscode arg_oneTimePasscode;
    private Faker<MimeMessage> fakeMailMessage;
    private MimeMessage builtMailMessage;
    private string emailPassword;

    private async Task WhenMethodIsCalled(){
        await service.SendCodeInEmail(arg_oneTimePasscode);
    }
    private void GivenTestMethodIsNotMocked(){
        base.GivenServiceIsSetup();
        serviceMock.Setup(x=>x.SendCodeInEmail(It.IsAny<OneTimePasscode>())).CallBase();
    }
    private void GivenArgumentsAreReady(){
        GivenTestMethodIsNotMocked();
        arg_oneTimePasscode=fakeOneTimePasscode.Generate();
    }
    private void GivenMessageGetsBuilt(){
        GivenArgumentsAreReady();
        builtMailMessage = fakeMailMessage.Generate(); 
        serviceMock.Setup(x=>x.BuildEmailMessage(arg_oneTimePasscode)).Returns(builtMailMessage);
    }
    [Test]
    public async Task ShouldBuildAMessage(){
        GivenArgumentsAreReady();
        await WhenMethodIsCalled();
        serviceMock.Verify(x=>x.BuildEmailMessage(arg_oneTimePasscode),Times.Once);
    }
    private void GivenSmtpPasswordIsConfigured(){
        GivenMessageGetsBuilt();
        emailPassword=faker.Random.AlphaNumeric(10);
        configurationMock.Setup(x=>x["ShariahStandardsDotOrgEmailPassword"]).Returns(emailPassword);
    }
    [Test]
    public async Task ShouldSendTheBuiltMessage(){
        GivenMessageGetsBuilt();
        await WhenMethodIsCalled();
        smtpClientMock.Verify(x=>x.Connect("mail.shariahstandards.org",465,true, CancellationToken.None),Times.Once);
        smtpClientMock.Verify(x=>x.Authenticate("no-reply@shariahstandards.org",emailPassword, CancellationToken.None),Times.Once);
        smtpClientMock.Verify(x=>x.SendAsync(builtMailMessage, CancellationToken.None,null),Times.Once);
        smtpClientMock.Verify(x=>x.Disconnect(true,CancellationToken.None),Times.Once);
    }

}