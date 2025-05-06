

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
			//.AddNewtonsoftJson();
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
			app.UseWebSockets();
			app.UseRouting();
			app.UseCors("_myAllowSpecificOrigins");
			app.UseAuthentication();
			app.UseAuthorization();
			app.UseResponseCompression();
			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllers();
				//endpoints.MapHub<NotificationHub>("/notificationhub");
			});
		}
	}
}
