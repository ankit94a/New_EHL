using EHL.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.Business.Interfaces
{
	public interface ILandingPageManager
	{
		public bool AddNew(News news);
		public List<News> GetAllNews();
		public bool AddLandingProfile(LandingProfile profile);
		public LandingProfile GetProfile();
	}
}
