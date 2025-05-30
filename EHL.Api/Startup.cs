

using System;
using Newtonsoft.Json;
using BIS.API.Filters;
using BIS.API.IOC;
using EHL.DB;
using BIS.API.Extensions.BIS.Api.Extensions;
using EHL.Business.Interfaces;
using EHL.Business.Implements;
using EHL.DB.Infrastructure;
using EHL.DB.Implements;
using BIS.Api.Extensions;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using System.Net;
using EHL.Common.Helpers;



namespace EHL.Api
{
    public class Startup
    {
        readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
        public IConfiguration Configuration { get; }
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        public void ConfigureServices(IServiceCollection services)
        {

            IoCConfiguration.Configuration(services);
            //services.AddSingleton<EncryptionService>();
            services.AddSingleton<LoginAttemptService>();
            services.AddSingleton(Configuration);
            services.AddCors(options =>
            {
                options.AddPolicy("_myAllowSpecificOrigins", builder =>
                {
                    // http://localhost:4200
                    // https://ehlweb.jayceetechsoftwares.com
                    builder.WithOrigins("http://localhost:4200")
                           .AllowAnyMethod()
                           .AllowAnyHeader()
                           .AllowCredentials();
                });
            });
            services.AddResponseCompression(options =>
            {
                options.EnableForHttps = true;
            });
            services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());

            });
            JwtTokenConfig.AddJwtTokenAuthentication(services, Configuration);
            services.AddSwaggerConfiguration();
            var nullValueSettings = new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore,
                MissingMemberHandling = MissingMemberHandling.Ignore
            };
            services.AddMvc(options =>
            {
                options.Filters.Add(typeof(ValidateModelFilter));
            }).AddDataAnnotationsLocalization();
            services.AddMemoryCache();

        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwaggerSetup();

                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "BIS API v1");
                    c.RoutePrefix = string.Empty;
                });

            }
            app.Use(async (context, next) =>
            {
                context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
                context.Response.Headers.Add("X-Frame-Options", "DENY");
                context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
                context.Response.Headers.Add("Referrer-Policy", "no-referrer");
                context.Response.Headers.Add("Permissions-Policy", "geolocation=(), microphone=()");
                context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
                context.Response.Headers.Add("Content-Security-Policy", "default-src 'self'; " + "script-src 'self'; " + "img-src 'self'; " + "font-src 'self'; " + "connect-src 'self'; " + "object-src 'none'; " + "frame-ancestors 'none'; " + "form-action 'self'; " + "base-uri 'self';");

                await next();
            });

            app.UseWebSockets();
            app.UseRouting();
            app.UseCors("_myAllowSpecificOrigins");
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseResponseCompression();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
