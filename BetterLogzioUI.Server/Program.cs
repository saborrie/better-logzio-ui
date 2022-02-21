using Yarp.ReverseProxy.Transforms;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"))
    .AddTransforms(transforms => transforms.AddPathRemovePrefix("/api"));

var app = builder.Build();
app.UseAuthorization();
app.UseStaticFiles();
app.MapReverseProxy();
app.MapFallbackToFile("index.html");
app.Run();
