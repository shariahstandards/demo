using Bogus;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Moq;
using ShariahStandards.org.Services;

namespace ShariahStandards.org.UnitTests.Services.TokenServiceTests;
public abstract class TokenServiceBaseTest{
    public TokenServiceBaseTest(){
        this.service=null!;
        this.serviceMock=null!;
        faker=new Faker();
    }

    protected TokenValidationParameters tokenValidationParameters=null!;
    protected Mock<TokenService> serviceMock;
    protected Faker faker;
    protected TokenService service;

    protected void GivenServiceIsSetup()
    {
        tokenValidationParameters=new TokenValidationParameters{
            ValidateIssuerSigningKey = true,  
            IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(Guid.NewGuid().ToByteArray()),  
            ValidateIssuer = false,  
            ValidateAudience = false,  
            RequireExpirationTime = false,  
            ValidateLifetime = true  
        };
        serviceMock=new Mock<TokenService>(
            tokenValidationParameters
        );
        service=serviceMock.Object;
    }
}