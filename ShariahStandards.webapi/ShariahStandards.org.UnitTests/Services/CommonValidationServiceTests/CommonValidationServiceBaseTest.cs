using Bogus;
using ShariahStandards.org.Services;

namespace ShariahStandards.org.UnitTests.Services.CommonValidationServiceTests;

public class CommonValidationServiceBaseTest{
    public CommonValidationServiceBaseTest()
    {
        faker=new Faker();
    }
    protected CommonValidationService service=null!;
    protected Faker faker;

    protected void GivenServiceIsSetup(){
        service=new CommonValidationService();
    }
}
