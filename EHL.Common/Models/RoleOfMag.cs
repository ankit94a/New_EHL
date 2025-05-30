using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EHL.Common.Models
{
    public class RoleOfMag : Base
    {
        public string Name { get; set; }
        public string Wing { get; set; }
        public int WingId { get; set; }
        public string NameOfOfficer { get; set; }
        public string Appointment { get; set; }
        public string MilitaryNo { get; set; }
        public string Mobile { get; set; }
        public string CivilNo { get; set; }
        public string EqptDealing { get; set; }
    }
}
