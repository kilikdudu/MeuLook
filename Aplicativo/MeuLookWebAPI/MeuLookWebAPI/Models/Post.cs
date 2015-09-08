using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MeuLookWebAPI.Models
{
    public class Post
    {
        public int postId { get; set; }
        public string imagem { get; set; }
        public DateTime dataPost { get; set; }
        public List<Categoria> categorias { get; set; }
    }
}