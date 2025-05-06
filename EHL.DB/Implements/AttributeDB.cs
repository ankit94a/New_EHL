using Dapper;
using EHL.Common.Models;
using EHL.DB.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;

namespace EHL.DB.Implements
{
	public class AttributeDB : BaseDB, IAttributeDB
	{
		public AttributeDB(IConfiguration configuration) : base(configuration)
		{

		}
        public bool AddWing(Wing wing)
        {
            string query = string.Format(@"insert into wing (name,createdby,createdon,isactive) values(@name,@createdby,@createdon,@isactive)");
            return connection.Execute(query, wing) > 0;
        }
        public bool UpdateWing(Wing wing)
        {
			//wing.Name = wing.Name.ToUpper();
            string query = "UPDATE wing SET name = @Name WHERE id = @Id";
            return connection.Execute(query, new { wing.Name, wing.Id }) > 0;

        }
        public bool AddCategory(Category category)
		{
			category.Name = category.Name.ToUpper();
			string query = string.Format(@"insert into category (name,createdby,createdon,isactive,wingid) values(@name,@createdby,@createdon,@isactive,@wingid)");
			return connection.Execute(query, category) > 0;
		}
        public bool UpdateCategory(Category category)
        {
            string query = "UPDATE category SET name = @Name WHERE id = @Id AND wingId = @WingId";
            return connection.Execute(query, new { category.Name, category.Id, category.WingId }) > 0;
        }

        public List<Wing> GetWing()
		{
			string query = string.Format(@"select * from wing where isactive=1");
			return connection.Query<Wing>(query).ToList();
		}
		public List<Category> GetCategories(long wingId)
		{
			string query = string.Format(@"select * from category where wingid=@wingid and isactive=1");
			return connection.Query<Category>(query,new {wingid = wingId}).ToList();
		}
		public bool DeactivateCategory(long Id)
		{
			string query = string.Format(@"update category set isactive=0 where id=@id");
			return connection.Execute(query, new { id = Id }) > 0;
		}

		public bool AddSubCategory(SubCategory subCategory)
		{
			string query = string.Format(@"insert into subcategory (name,createdby,createdon,isactive,categoryid) values(@name,@createdby,@createdon,@isactive,@categoryid)");
			return connection.Execute(query, subCategory) > 0;
		}

		public List<SubCategory> GetSubCategories(long categoryId)
		{
			string query = string.Format(@"select * from subcategory where categoryid = @categoryid and isactive=1");
			return connection.Query<SubCategory>(query, new { categoryid = categoryId }).ToList();
		}
		public bool DeactivateSubCategory(long Id)
		{
			string query = string.Format(@"update subcategory set isactive=0 where id=@id");
			return connection.Execute(query, new { id = Id }) > 0;
		}

		public bool AddEqpt(Eqpt eqpt)
		{
			string query = string.Format(@"insert into eqpt (name,createdby,createdon,isactive,categoryid,subcategoryid) values(@name,@createdby,@createdon,@isactive,@categoryid,@subcategoryid)");
			return connection.Execute(query, eqpt) > 0;
		}

		public List<Eqpt> GetEqpt(long categoryId,long subCategoryId)
		{
			string query = string.Format(@"select * from eqpt where categoryid = @categoryid and subcategoryid=@subcategoryid and isactive=1");
			return connection.Query<Eqpt>(query, new { categoryid = categoryId, subcategoryid=subCategoryId }).ToList();
		}
		public bool DeactivateEqpt(long Id)
		{
			string query = string.Format(@"update eqpt set isactive=0 where id=@id");
			return connection.Execute(query, new { id = Id }) > 0;
		}
        public bool DeleteEmer(DeleteEmer data)
        {
            string query = $"UPDATE {data.TableName} SET isactive = 0 WHERE id = @id";
            return connection.Execute(query, new { id = data.Id }) > 0;
        }

    }
}
