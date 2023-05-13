using EmailValidation;
namespace ShariahStandards.org.Services;
public interface ICommonValidationService
{
    void ValidateEmail(string email);
}
public class CommonValidationService : ICommonValidationService
{

    public void ValidateEmail(string email)
    {
        if(!EmailValidator.Validate(email,false,true)){
            throw new Resources.InvalidRequestException("INVALID_EMAIL","invalid email address");
        }
    }
}