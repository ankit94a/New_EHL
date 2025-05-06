using EHL.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.Business.Interfaces
{
	public interface IEmerManager
	{
		public List<EmerModel> GetAllEmer(long wingId);
		public Task<bool> AddEmer(EmerModel emer);
		public Task<bool> UpdateEmer(EmerModel emer);
		public bool DeactivateEmer(long Id);

		public List<EmerModel> GetAllMasterSheet();
		public List<EmerModel> GetLatestEmer();
        public Task<bool> AddEmerIndex(EmerIndex emer);
        public Task<bool> UpdateEmerIndex(EmerIndex emer);
        public List<EmerIndex> GetEmerIndex(int wingId);
        public bool DeactiveEmerIndex(long Id);
        public List<Policy> GetLatestTwoPoliciesPerType();
	}
}
