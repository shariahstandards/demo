namespace ShariahStandards.org.Resources;
public record LoginResult(bool Success, string JWT);
public record SendOTPRequest(string Email);
public record SimplePostResult(bool Success);
