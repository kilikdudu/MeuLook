var args = arguments[0] || {};

$.init = function(){
	try{
		Alloy.Globals.configWindow($.winPrincipal, $);
		$.minhaTopBar.iniciar("MeuLook");
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/controllers/AprovacaoPagamento/DetalhesProcessoDePagamento.js");
	} 
};

$.winPrincipal.addEventListener("open", function(e){
	var Classificar = Alloy.createController("Classificar/Classificar", {pai: $});
	$.minhaScrollable.init([Classificar.getView()], ["Looks"], {cacheSize: 3});
});
