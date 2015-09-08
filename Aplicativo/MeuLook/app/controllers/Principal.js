var args = arguments[0] || {};

var btnFiltrar = null;

var categorias = Alloy.createCollection("Categoria");

var listaCategorias= Alloy.createWidget("GUI", "PopUpList");

var botoes = null;

$.init = function(){
	try{
		Alloy.Globals.configWindow($.winPrincipal, $);
		$.minhaTopBar.iniciar("Vale24h");
		btnFiltrar = $.minhaTopBar.addRightButtom("/images/categoria.png", filtro);
		$.minhaTopBar.enableFilter($);
		listaCategorias.init("Categorias", categorias, ["id"], "descricao", setCategoria);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/controllers/AprovacaoPagamento/DetalhesProcessoDePagamento.js");
	} 
};

function filtro(e){
	var ws = Alloy.createWidget("WebService").iniciarHttpRequest({
		callback: sucessFiltro,
		error: failFiltro,
		url:  Alloy.Globals.MainDomain + "api/categorias/getCategorias", 
		metodo: "POST", 
		timeout: 120000,
		colecao: categorias
	});
	if(ws){
		ws.NovoEnvia();
	}
}

function sucessFiltro(e){
	categorias.trigger("change");
	listaCategorias.show();
}

function failFiltro(e){
	Alloy.Globals.Alerta("Erro", "Ocorreu um erro ao obter as categorias, tente novamente mais tarde.");
}

function setCategoria(texto, chave){
	Ti.API.info("teste categoria: " + texto + "|" + chave);
	$.trigger("categoria", {id: chave, descricao: texto});
}

$.minhaTopBar.on("abrirBuscar", function(e){
	$.minhaScrollable.removePageControl();
});

$.minhaTopBar.on("fecharBuscar", function(e){
	$.minhaScrollable.adicionaPageControl();
});

$.minhaScrollable.on("changeView", function(e){
	if(e.id == 1){
		botoes = $.minhaTopBar.removeAll();
	}else if((e.id == 0) && (botoes != null)){
		for(var i = 0; i < botoes.length; i++){
			$.minhaTopBar.addOldButton(botoes[i]);
		}
	}
});

$.winPrincipal.addEventListener("open", function(e){
	var Posts = Alloy.createController("Promocao/ListaPromocoes", {pai: $});
	var MeusTickets = Alloy.createController("MeusTickets/ListaTickets", {pai: $});
	$.minhaScrollable.init([Posts.getView(), MeusTickets.getView()], ["Promoções", "Tickets"], {cacheSize: 3});
});
