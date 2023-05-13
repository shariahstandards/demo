using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using ShariahStandards.org.DatabaseModel;
using ShariahStandards.org.Resources;
using ShariahStandards.org.Services;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(option=>
    {
        option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
        {
            Name = "Authorization",
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 1safsfsdfdfd\"",
        });
        option.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    new string[] {}
            }
        });
    } 
);

IConfiguration config = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .AddEnvironmentVariables()
    .Build();

builder.Services.AddLogging(config=>
{
    config.AddDebug();
    config.AddConsole();
});
builder.Logging.AddFile("../Logs/ShariahStgandards-{Date}.txt");
builder.Services.AddDbContext<ApplicationDbContext>(optionsBuilder => {
        optionsBuilder
        .UseLazyLoadingProxies()
        .UseSqlServer(config.GetConnectionString("MainDatabase"));
    });

builder.Services.AddScoped<IApplicationDbContext,ApplicationDbContext>();
builder.Services.AddScoped<ICommonValidationService,CommonValidationService>();
builder.Services.AddScoped<IOneTimePasscodeService,OneTimePasscodeService>();
builder.Services.AddScoped<ISmtpClient,SmtpClient>();
builder.Services.AddScoped<ITokenService,TokenService>();
builder.Services.AddScoped<ITokenService,TokenService>();
builder.Services.AddScoped<ICurrentUserService,CurrentUserService>();
builder.Services.AddScoped<IQuranVerseCommentService,QuranVerseCommentService>();

var key = System.Text.Encoding.UTF8.GetBytes(config["ShariahStandardsDotOrgJwtSecret"]??"default secret");
var tokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
{  
    ValidateIssuerSigningKey = true,  
    IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(key),  
    ValidateIssuer = false,  
    ValidateAudience = false,  
    RequireExpirationTime = false,  
    ValidateLifetime = true  
}; 
builder.Services.AddSingleton(tokenValidationParameters); 
builder.Services.AddAuthentication(x =>  
{  
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;  
    x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;  
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;  

})  
.AddJwtBearer(x =>  
{  
    x.RequireHttpsMetadata = false;  
    x.SaveToken = true;  
    x.TokenValidationParameters = tokenValidationParameters;  

});  

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.Use(async (context,next)=>{
    try{
        await next(context);
    }catch(InvalidRequestException ex){
        context.Response.Clear();
        context.Response.StatusCode=400;
        await context.Response.WriteAsJsonAsync(new {ex.DeveloperFriendlyMessage,ex.ErrorCode});
        await context.Response.CompleteAsync();
    }
});
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
