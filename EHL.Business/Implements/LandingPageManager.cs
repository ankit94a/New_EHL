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
        public bool Deactivate(DeactivateModel item)
		{
			return _landingPageDb.Deactivate(item);
		}

    }
}
