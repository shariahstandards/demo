using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ShariahStandards.org.DatabaseModel;
using ShariahStandards.org.Resources;

namespace ShariahStandards.org.Services;
public interface ITokenService{
    string BuildNewJsonWebToken(OneTimePasscode oneTimePasscode);
}
public class TokenService : ITokenService
{
    private readonly TokenValidationParameters _tokenValidationParameters;

    public TokenService(
        TokenValidationParameters tokenValidationParameters){
        _tokenValidationParameters = tokenValidationParameters;
    }
    public virtual string BuildNewJsonWebToken(OneTimePasscode oneTimePasscode)
    {
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = BuildSubject(oneTimePasscode),
            Expires = DateTime.UtcNow.Add(new TimeSpan(24, 0, 0)),
            SigningCredentials = new SigningCredentials(_tokenValidationParameters.IssuerSigningKey, SecurityAlgorithms.HmacSha256Signature)
        };
        var tokenHandler = new JwtSecurityTokenHandler();
        var securityToken = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(securityToken);
        return tokenString;
    }

    private ClaimsIdentity BuildSubject(OneTimePasscode oneTimePasscode)
    {
          ClaimsIdentity subject = new ClaimsIdentity(new Claim[]
                {  
                new Claim("email",oneTimePasscode.Email),
                new Claim(ClaimTypes.Name,oneTimePasscode.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                });
        return subject;
    }
}