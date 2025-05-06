using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
namespace EHL.DB.Implements
{
	public class DashboardDB : BaseDB
	{
		public DashboardDB(IConfiguration configuration) : base(configuration)
		{

		}
	}
}
