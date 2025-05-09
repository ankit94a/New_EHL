using EHL.Api.Helpers;
using EHL.Business.Implements;
using EHL.Business.Interfaces;
using EHL.Common.Models;
using InSync.Api.Helpers;
using Microsoft.AspNetCore.Mvc;
using static EHL.Common.Enum.Enum;

namespace EHL.Api.Controllers
{
	[Route("api/[controller]")]
	public class AttributeController : ControllerBase
	{
		private readonly IAttributeManager _attributeManager;
		public AttributeController(IAttributeManager attributeManager)
		{
			_attributeManager = attributeManager;
		}
		[Authorization(RoleType.Admin)]
		[HttpPost, Route("wing")]
		public IActionResult AddCategory([FromBody] Wing wing)
		{
			wing.CreatedBy = HttpContext.GetUserId();
			wing.CreatedOn = DateTime.Now;
			wing.IsDeleted = false;
			wing.IsActive = true;
			return Ok(_attributeManager.AddWing(wing));
		}
		[Authorization(RoleType.Admin)]
		[HttpPost, Route("wing/update")]
        public IActionResult UpdateCategory([FromBody] Wing wing)
        {
            wing.CreatedBy = HttpContext.GetUserId();
            wing.CreatedOn = DateTime.Now;
            wing.IsDeleted = false;
            wing.IsActive = true;
            return Ok(_attributeManager.UpdateWing(wing));
        }
		[Authorization(RoleType.Admin)]
		[HttpPost, Route("category")]
		public IActionResult AddCategory([FromBody] Category category)
		{
			category.Name = category.Name.ToUpper();
			category.CreatedBy = HttpContext.GetUserId();
			category.CreatedOn = DateTime.Now;
			category.IsDeleted = false;
			category.IsActive = true;
			return Ok(_attributeManager.AddCategory(category));
		}
		[Authorization(RoleType.Admin)]
		[HttpPost, Route("category/update")]
        public IActionResult UpdateCategory([FromBody] Category category)
        {
            category.Name = category.Name.ToUpper();
            category.CreatedBy = HttpContext.GetUserId();
            category.CreatedOn = DateTime.Now;
            category.IsDeleted = false;
            category.IsActive = true;
            return Ok(_attributeManager.UpdateCategory(category));
        }
		[Authorization(RoleType.Admin)]
		[HttpPost, Route("subcategory")]
		public IActionResult AddSubCategory([FromBody] SubCategory subCategory)
		{
			subCategory.Name = subCategory.Name.ToUpper();
			subCategory.CreatedBy = HttpContext.GetUserId();
			subCategory.CreatedOn = DateTime.Now;
			subCategory.IsDeleted = false;
			subCategory.IsActive = true;
			return Ok(_attributeManager.AddSubCategory(subCategory));
		}
		[Authorization(RoleType.Admin)]
		[HttpPost, Route("eqpt")]
		public IActionResult AddEqpt([FromBody] Eqpt eqpt)
		{
			eqpt.Name = eqpt.Name.ToUpper();
			eqpt.CreatedBy = HttpContext.GetUserId();
			eqpt.CreatedOn = DateTime.Now;
			eqpt.IsDeleted = false;
			eqpt.IsActive = true;
			return Ok(_attributeManager.AddEqpt(eqpt));
		}
		[HttpGet, Route("wing")]
		public IActionResult GetAllWings()
		{
			return Ok(_attributeManager.GetWing());
		}
		[HttpGet, Route("category{wingId}")]
		public IActionResult GetWing(long wingId)
		{
			return Ok(_attributeManager.GetCategories(wingId));
		}
		[HttpGet, Route("subcategory{categoryId}")]
		public IActionResult GetSubCategory(long categoryId)
		{
			return Ok(_attributeManager.GetSubCategories(categoryId));
		}
		[HttpGet, Route("eqpt{categoryId}/{subCategoryId}")]
		public IActionResult GetSubCategory(long categoryId,long subCategoryId)
		{
			return Ok(_attributeManager.GetEqpt(categoryId,subCategoryId));
		}
		[Authorization(RoleType.Admin)]
		[HttpPut, Route("category")]
		public IActionResult DeactiveCategory([FromBody] Category category)
		{
			return Ok(_attributeManager.DeactivateCategory(category.Id));
		}
		[Authorization(RoleType.Admin)]
		[HttpPut, Route("subcategory")]
		public IActionResult DeactiveSubCategory([FromBody] SubCategory subCategory)
		{
			return Ok(_attributeManager.DeactivateSubCategory(subCategory.Id));
		}
		[Authorization(RoleType.Admin)]
		[HttpPut, Route("eqpt")]
		public IActionResult DeactiveEqpt([FromBody] Eqpt eqpt)
		{
			return Ok(_attributeManager.DeactivateCategory(eqpt.Id));
		}
		[Authorization(RoleType.Admin)]
		[HttpPost, Route("delete")]
		public IActionResult DeleteEmer([FromBody] DeleteEmer data)
		{
            return Ok(_attributeManager.DeleteEmer(data));
        }
		

	}
}
