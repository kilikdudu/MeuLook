using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Vale24hWebAPI.Models
{
    public class ParansLista
    {
        public int cursor { get; set; }
        public int limite { get; set; }
        public string buscar { get; set; }
        public Nullable<int> categoria { get; set; }
    }
}