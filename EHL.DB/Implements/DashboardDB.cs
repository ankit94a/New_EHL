using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using EHL.Common.Models;
using EHL.DB.Interfaces;
using Microsoft.Extensions.Configuration;
namespace EHL.DB.Implements
{
    public class DashboardDB : BaseDB, IDashboardDB
    {
        public DashboardDB(IConfiguration configuration) : base(configuration)
        {
        }

        public Dashboard GetAllEmerCount(long wingId)
        {
            try
            {
                string query = @"
            SELECT
                (SELECT COUNT(*) FROM emer WHERE wingid = @wingid AND isactive = 1) AS WingEmerCount,
                (SELECT COUNT(*) FROM emer WHERE isactive = 1) AS TotalEmerCount,
                (SELECT COUNT(*) FROM emer WHERE wingid = @wingid AND isactive = 1 AND createdon >= DATEADD(MONTH, -6, GETDATE())) AS SixMonthWingEmerCount
        ";

                var result = connection.QuerySingle<Dashboard>(query, new { wingid = wingId });
                return result;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public List<DashboardCategory> GetAllCategory(long wingId)
        {
            try
            {
                string query = @"SELECT name FROM category WHERE wingid = @wingid AND isactive = 1";
                var result = connection.Query<DashboardCategory>(query, new { wingid = wingId }).ToList();
                return result;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public List<DashboardCategory> GetAllSubCategory(long wingId)
        {
            try
            {
                string query = @"select s.name from subcategory s inner join (select id from category where wingid = @wingId and isActive=1) as c on s.categoryid = c.id where isActive=1";

                var result = connection.Query<DashboardCategory>(query, new { wingid = wingId }).ToList();
                return result;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public List<DashboardCategory> GetAllEqpt(long wingId)
        {
            try
            {
                string query = @"
            SELECT e.name
            FROM eqpt e
            INNER JOIN category c ON e.categoryId = c.id AND c.isActive = 1
            INNER JOIN subcategory sc ON e.subCategoryId = sc.id AND sc.isActive = 1
            WHERE c.wingId = @wingId
              AND e.isActive = 1
              AND sc.categoryId = c.id";
                var result = connection.Query<DashboardCategory>(query, new { wingid = wingId }).ToList();
                return result;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        public List<DashOneYearCount> GetEmerMonthWiseCount(long wingId)
        {
            try
            {
                string query = @"
WITH Last12Months AS (
    SELECT 
        FORMAT(DATEADD(MONTH, -n, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)), 'yyyy-MM') AS YearMonth,
        DATENAME(MONTH, DATEADD(MONTH, -n, GETDATE())) + ' ' + CAST(YEAR(DATEADD(MONTH, -n, GETDATE())) AS VARCHAR) AS MonthName
    FROM (VALUES (0),(1),(2),(3),(4),(5),(6),(7),(8),(9),(10),(11)) AS X(n)
),
EmerData AS (
    SELECT 
        FORMAT(createdon, 'yyyy-MM') AS YearMonth,
        COUNT(*) AS count
    FROM emer
    WHERE 
        wingid = @wingId AND
        isactive = 1 AND
        createdon >= DATEADD(MONTH, -11, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)) AND
        createdon < DATEADD(MONTH, 1, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1))
    GROUP BY FORMAT(createdon, 'yyyy-MM')
)
SELECT 
    l.MonthName,
    ISNULL(e.count, 0) AS count
FROM Last12Months l
LEFT JOIN EmerData e ON l.YearMonth = e.YearMonth
ORDER BY l.YearMonth;
";

                var result = connection.Query<DashOneYearCount>(query, new { wingId }).ToList();
                return result;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public List<DashOneYearCount> GetPolicyMonthWiseCount(long wingId)
        {
            try
            {
                string query = @"
WITH Last12Months AS (
    SELECT 
        FORMAT(DATEADD(MONTH, -n, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)), 'yyyy-MM') AS YearMonth,
        DATENAME(MONTH, DATEADD(MONTH, -n, GETDATE())) + ' ' + CAST(YEAR(DATEADD(MONTH, -n, GETDATE())) AS VARCHAR) AS MonthName
    FROM (VALUES (0),(1),(2),(3),(4),(5),(6),(7),(8),(9),(10),(11)) AS X(n)
),
EmerData AS (
    SELECT 
        FORMAT(createdon, 'yyyy-MM') AS YearMonth,
        COUNT(*) AS count
    FROM policy
    WHERE 
        wingid = @wingId AND
 type = 'Policy Compendium' AND
        isactive = 1 AND
        createdon >= DATEADD(MONTH, -11, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)) AND
        createdon < DATEADD(MONTH, 1, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1))
    GROUP BY FORMAT(createdon, 'yyyy-MM')
)
SELECT 
    l.MonthName,
    ISNULL(e.count, 0) AS count
FROM Last12Months l
LEFT JOIN EmerData e ON l.YearMonth = e.YearMonth
ORDER BY l.YearMonth;
";

                var result = connection.Query<DashOneYearCount>(query, new { wingId }).ToList();
                return result;
            }
            catch (Exception ex)
            {
                throw;
            }
        }




    }
}
