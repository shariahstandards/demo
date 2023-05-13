namespace ShariahStandards.org.Resources;
public class InvalidRequestException:Exception{
    public InvalidRequestException(string errorCode,string developerFriendlyMessage):base(developerFriendlyMessage)
    {
        ErrorCode = errorCode;
        DeveloperFriendlyMessage = developerFriendlyMessage;
    }

    public string ErrorCode { get; }
    public string DeveloperFriendlyMessage { get; }
}