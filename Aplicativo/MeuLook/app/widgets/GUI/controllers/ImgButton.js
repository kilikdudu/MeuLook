var args = arguments[0] || {};

$.boxButton.applyProperties(args);
$.boxButton.dados = args;

$.imagem.setImage(args.imagem);
$.imagem.setHeight(args.tamanho);
$.imagem.setWidth(args.tamanho);
$.imagem.dados = args;

$.descricao.setText(args.descricao);
$.descricao.setColor(args.corDescricao || Alloy.Globals.MainColor);
$.descricao.setFont({fontSize: args.fontSize});
$.descricao.dados = args;

