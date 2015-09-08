using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using MeuLookWebAPI;
using MeuLookWebAPI.Models;

namespace MeuLookWebAPI.Controllers
{
    public class notasController : ApiController
    {
        private meulookEntities db = new meulookEntities();

        [HttpPost]
        public List<Categoria> getNotas()
        {
            var categorias = new List<Categoria>();
            var rows = db.notas.ToList();
            foreach (var row in rows)
            {
                var categoria = new Categoria();
                categoria.descricao = row.Descricao;
                categoria.id = row.IdNota;
                categorias.Add(categoria);
            }
            return categorias;
        }
    }
}