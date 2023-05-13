using Moq;
using NUnit.Framework;
using ShariahStandards.org.DatabaseModel;

namespace ShariahStandards.org.UnitTests.Services.OneTimePasscodeServiceTests;

public class SendOneTimePasscodeTests : OneTimePasscodeServiceBaseTest
{
    private string arg_email = null!;
    private IQueryable<OneTimePasscode> otherOneTimePasscodes=null!;
    private OneTimePasscode matchingOneTimePasscode=null!;
    private IQueryable<OneTimePasscode> oneTimePasscodesWithMatch=null!;

    private void WhenMethodIsCalled()
    {
        service.SendOneTimePasscode(arg_email);
    }
    private void GivenMethodArgumentsAreSetup()
    {
        GivenServiceIsSetup();
        arg_email = faker.Internet.Email();
    }
    [Test]
    public void ShouldValidateTheEmail()
    {
        GivenMethodArgumentsAreSetup();
        WhenMethodIsCalled();
        commonValidationServiceMock.Verify(x=>x.ValidateEmail(arg_email),Times.Once);
    }
    private OneTimePasscode GenerateWithEmail(string email){
        var otp=fakeOneTimePasscode.Generate();
        otp.Email=email;
        return otp;

    }
    private void GivenThereIsNoMatchingOneTimePasscodeInTheDatabase(){
        GivenMethodArgumentsAreSetup();
        otherOneTimePasscodes = new List<OneTimePasscode>{
            GenerateWithEmail("not"+arg_email)
        }.AsQueryable();
        applicationDbContextMock.Setup(x=>x.Set<OneTimePasscode>()).Returns(otherOneTimePasscodes);
    }
    [Test]
    public void ThereIsNoMatchingOneTimePasscodeInTheDatabase_ShouldAddOneToTheDb(){
        GivenThereIsNoMatchingOneTimePasscodeInTheDatabase();
        WhenMethodIsCalled();
        serviceMock.Verify(x=>x.SaveNewOneTimePasscode(arg_email),Times.Once);
    }
    private void GivenThereIsAMatchingOneTimePasscodeInTheDatabase(){
        GivenMethodArgumentsAreSetup();
        matchingOneTimePasscode= GenerateWithEmail(arg_email);

        oneTimePasscodesWithMatch = new List<OneTimePasscode>{
            GenerateWithEmail("not"+arg_email),
            matchingOneTimePasscode
        }.AsQueryable();
        applicationDbContextMock.Setup(x=>x.Set<OneTimePasscode>()).Returns(oneTimePasscodesWithMatch);
    }
    [Test]
    public void ThereIsAMatchingOneTimePasscodeInTheDatabase_ShouldUpdateThepasscode(){
        GivenThereIsAMatchingOneTimePasscodeInTheDatabase();
        WhenMethodIsCalled();
        serviceMock.Verify(x=>x.UpdatePasscode(matchingOneTimePasscode),Times.Once);
    }
    
}