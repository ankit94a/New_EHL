using EHL.Business.Interfaces;
using EHL.Common.Models;
using EHL.DB.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.Business.Implements
{
	public class AttributeManager : IAttributeManager
	{
		private readonly IAttributeDB _attributeDb;
		public AttributeManager(IAttributeDB attributeDB)
		{
			_attributeDb = attributeDB;
		}
		public List<Wing> GetWing()
		{
			return _attributeDb.GetWing();
		}
		public bool AddWing(Wing wing)
		{
			return _attributeDb.AddWing(wing);
		}
        public bool UpdateWing(Wing wing)
        {
            return _attributeDb.UpdateWing(wing);
        }
        public bool AddCategory(Category category)
		{
			return _attributeDb.AddCategory(category);
		}
        public bool UpdateCategory(Category category)
        {
            return _attributeDb.UpdateCategory(category);
        }
        public List<Category> GetCategories(long wingId)
		{
			return _attributeDb.GetCategories(wingId);
		}
		public bool DeactivateCategory(long Id)
		{
			return _attributeDb.DeactivateCategory(Id);
		}
		public bool AddSubCategory(SubCategory subCategory)
		{
			return _attributeDb.AddSubCategory(subCategory);
		}
		public List<SubCategory> GetSubCategories(long categoryId)
		{
			return _attributeDb.GetSubCategories(categoryId);
		}
		public bool DeactivateSubCategory(long Id)
		{
			return _attributeDb.DeactivateSubCategory(Id);
		}

		public bool AddEqpt(Eqpt eqpt)
		{
			return _attributeDb.AddEqpt(eqpt);
		}
		public List<Eqpt> GetEqpt(long categoryId, long subCategoryId)
		{
			return _attributeDb.GetEqpt(categoryId, subCategoryId);
		}
		public bool DeactivateEqpt(long Id)
		{
			return _attributeDb.DeactivateEqpt(Id);
		}
        public bool DeleteEmer(DeleteEmer data)
        {
            return _attributeDb.DeleteEmer(data);
        }
    }
}
