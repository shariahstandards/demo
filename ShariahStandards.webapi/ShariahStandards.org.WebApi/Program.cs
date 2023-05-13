using MailKit.Net.Smtp;
using Microsoft.EntityFrameworkCore;
using ShariahStandards.org.DatabaseModel;
using ShariahStandards.org.Resources;
using ShariahStandards.org.Services;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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
builder.Services.AddDbContext<ApplicationDbContext>(builder => {
                builder
                .UseLazyLoadingProxies()
                .UseSqlServer(config.GetConnectionString("MainDatabase"));
            });

builder.Services.AddScoped<IApplicationDbContext,ApplicationDbContext>();
builder.Services.AddScoped<ICommonValidationService,CommonValidationService>();
builder.Services.AddScoped<IOneTimePasscodeService,OneTimePasscodeService>();
builder.Services.AddScoped<ISmtpClient,SmtpClient>();

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
