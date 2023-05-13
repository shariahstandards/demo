using Bogus;
using FluentAssertions;
using Moq;
using NUnit.Framework;

namespace ShariahStandards.org.UnitTests.Services.CommonValidationServiceTests;
public class ValidateEmailTests:CommonValidationServiceBaseTest{
    private string arg_email=null!;

   
    private void WhenMethodIsCalled(){
        service.ValidateEmail(arg_email);
    }
    private void GivenAValidEmailIsSetAsTheArgument(){
        base.GivenServiceIsSetup();
        arg_email=faker.Internet.Email();
    }
    [Test]
    public void AValidEmailIsSet_ShouldNotThrow(){
        GivenAValidEmailIsSetAsTheArgument();
        var action =()=>WhenMethodIsCalled();
        action.Should().NotThrow();
    }
    [TestCase("a-non-email")]
    [TestCase("a-non-email@someaddress")]
    [TestCase("a non email@someaddress")]
    [TestCase("anear?email@someaddress")]
    public void AInvalidEmailIsSet_ShouldThrowAnInvalidRequestException(string invalidEmail){
        base.GivenServiceIsSetup();
        arg_email=invalidEmail;
        var action =()=>WhenMethodIsCalled();
        action.Should().Throw<Resources.InvalidRequestException>()
            .WithMessage("invalid email address");
    }
}