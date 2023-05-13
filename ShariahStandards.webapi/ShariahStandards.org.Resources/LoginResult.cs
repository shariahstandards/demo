namespace ShariahStandards.org.Resources;
public record LoginWithOneTimePasscodeRequest(string Email, string Passcode);
public record LoginResult(bool Success, string JWT);
public record SendOTPRequest(string Email);
