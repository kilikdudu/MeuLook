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
using System.Web.Configuration;
using Vale24hWebAPI.Models;
using System.Drawing;
using System.IO;
using MeuLookWebAPI.Models;
using System.Drawing.Imaging;
using System.Web;

namespace MeuLookWebAPI.Controllers
{
    public class fotopostsController : ApiController
    {
        private meulookEntities db = new meulookEntities();

        [HttpPost]
        public StatusRequisicao postar(Params_postar parans)
        {

            var diretorio = HttpContext.Current.Server.MapPath("~/") + "imagens\\usuarios\\" + parans.cloudId + "\\";
            var resposta = new StatusRequisicao();

            using (var dbTrans = db.Database.BeginTransaction())
            {
                try
                {
                    fotoposts post = db.fotoposts.Create();
                    post.DataPost  = DateTime.Now;
                    post.Usuarios_cloudId = parans.cloudId;
                    post.ImagemPost = "";
                    db.fotoposts.Add(post);
                    db.SaveChanges();

                    byte[] byteArray = Convert.FromBase64String(parans.imagem);
                    Image result = null;
                    ImageFormat format = ImageFormat.Png;
                    result = new Bitmap(new MemoryStream(byteArray));
                    using (Image imageToExport = result)
                    {
                        (new FileInfo(diretorio)).Directory.Create();
                        imageToExport.Save(diretorio + post.IdPost.ToString() + "." + format.ToString(), format);
                    }

                    post.ImagemPost = "usuarios/" + parans.cloudId + "/" + post.IdPost.ToString();

                    db.SaveChanges();
                    dbTrans.Commit();
                    resposta.sucesso = true;
                    //Por isso MeuLook ^_^
                    resposta.mensagem = "Look publicado !";
                }
                catch (Exception e)
                {
                    dbTrans.Rollback();
                    resposta.sucesso = false;
                    resposta.mensagem = e.Message;
                }

            }

            return resposta;
        }

        [HttpPost]
        public Post getPost(Params_getPost parans)
        {
            var post = new Post();
            var postsViaveis = db.fotoposts.Include(fp => fp.avaliacoes).Include(fp => fp.usuarios).Where(fp => fp.avaliacoes.Count < fp.usuarios.Alcance).ToArray();
            var indice = new Random().Next(0, postsViaveis.Length - 1);
            var postSelecionado = postsViaveis[indice];
            post.dataPost = postSelecionado.DataPost;
            post.imagem = WebConfigurationManager.AppSettings["urlImages"] + postSelecionado.ImagemPost;
            post.postId = postSelecionado.IdPost;
            post.categorias = new notasController().getNotas();
            return post;
        }

        [HttpPost]
        public StatusRequisicao deletePost(Params_deletePost parans)
        {

            var diretorio = HttpContext.Current.Server.MapPath("~/") + "imagens\\usuarios\\" + parans.cloudId + "\\";
            var resposta = new StatusRequisicao();

            using (var dbTrans = db.Database.BeginTransaction())
            {
                try
                {
                    fotoposts post = db.fotoposts.Where(fp => fp.Usuarios_cloudId == parans.cloudId && fp.IdPost == parans.postId).FirstOrDefault();
                    db.fotoposts.Remove(post);
                    File.Delete(diretorio + parans.postId + ".png");
                    db.SaveChanges();
                    dbTrans.Commit();
                    resposta.sucesso = true;
                    resposta.mensagem = "Post deletado";
                }
                catch (Exception e)
                {
                    dbTrans.Rollback();
                    resposta.sucesso = false;
                    resposta.mensagem = e.Message;
                }

            }

            return resposta;
        }

    }
    #region Parâmetros
    public class Params_postar
    {
        public string cloudId { get; set; }
        public string imagem { get; set; }
    }

    public class Params_getPost
    {
        public string cloudId { get; set; }
    }
    public class Params_deletePost
    {
        public string cloudId { get; set; }
        public int postId { get; set; }
    }

    #endregion
}