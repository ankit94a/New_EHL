﻿using EHL.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.DB.Infrastructure
{
	public interface ILandingPageDB
	{
		public bool AddNew(News news);
		public List<News> GetAllNews();
		public bool AddLandingProfile(LandingProfile profile);
		public LandingProfile GetProfile();
		public bool Deactivate(DeactivateModel item);

    }
}
