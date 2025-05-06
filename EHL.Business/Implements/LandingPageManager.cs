using EHL.Business.Interfaces;
using EHL.Common.Models;
using EHL.DB.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static EHL.Common.Enum.Enum;

namespace EHL.Business.Implements
{
	public class LandingPageManager : ILandingPageManager
	{
		private readonly ILandingPageDB _landingPageDb;
		public LandingPageManager(ILandingPageDB landingPageDb)
		{
			_landingPageDb = landingPageDb;
		}

		public bool AddNew(News news)
		{
			news.Status = NewStatus.New;
			news.CreatedBy = 3;
			news.CreatedOn = DateTime.UtcNow;
			news.IsActive = true;
			news.IsDeleted = false;
			return _landingPageDb.AddNew(news);
		}
		public List<News> GetAllNews()
		{
			return _landingPageDb.GetAllNews();
		}
		public bool AddLandingProfile(LandingProfile profile)
		{
			profile.CreatedBy = 3;
			profile.CreatedOn = DateTime.UtcNow;
			profile.IsActive = true;
			profile.IsDeleted = false;
			return _landingPageDb.AddLandingProfile(profile);
		}
		public LandingProfile GetProfile()
		{
			return _landingPageDb.GetProfile();
		}
	}
}
