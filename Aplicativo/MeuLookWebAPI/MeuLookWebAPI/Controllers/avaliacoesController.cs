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
using Vale24hWebAPI.Models;

namespace MeuLookWebAPI.Controllers
{
    public class avaliacoesController : ApiController
    {
        private meulookEntities db = new meulookEntities();
        public StatusRequisicao avaliaPost(Params_avaliaPost parans)
        {
            var resposta = new StatusRequisicao();
            try
            {
                var usuario = db.usuarios.Where(u => u.cloudId == parans.cloudId).FirstOrDefault();
                usuario.QtdeAvaliacao++;
                db.SaveChanges();
                if (db.avaliacoes.Where(a => a.FotoPosts_IdPost == parans.postId).Count() < db.fotoposts.Include(fp => fp.usuarios).Where(fp => fp.IdPost == parans.postId).FirstOrDefault().usuarios.Alcance)
                {
                    var minhaAvaliacao = db.avaliacoes.Create();
                    minhaAvaliacao.FotoPosts_IdPost = parans.postId;
                    minhaAvaliacao.Notas_IdNota = parans.categoriaId;
                    db.avaliacoes.Add(minhaAvaliacao);
                    db.SaveChanges();
                }
                resposta.sucesso = true;
            }
            catch (Exception e)
            {
                resposta.sucesso = false;
                resposta.mensagem = e.Message;
            }
            return resposta;
        }

    }
    #region Parâmetros
    public class Params_avaliaPost
    {
        public int postId { get; set; }
        public int categoriaId { get; set; }
        public string cloudId { get; set; }
    }
    #endregion
}