/**
 * @class widgets.GUI.Topbar
 * Barra no topo do App.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
var args = arguments[0] || {};

var inputSearch = null;
var searchBar = null;
var semaforo = false;

var tamanhoBotao = 32;
var gapDireitaBotao = 10;
var boxBuscar = {};
var btnBuscar= null;
var sField = null;

var anAddBoxBuscar = Ti.UI.createAnimation({
	width: Ti.UI.FILL,
	duration: 200
});

anAddBoxBuscar.addEventListener("start", function(e){
	$.trigger("abrirBuscar", {});
});

anAddBoxBuscar.addEventListener("complete", function(e){
	boxBuscar.borderRadius = 0;
	sField.focus();
});

var anRemBoxBuscar = Ti.UI.createAnimation({
	width: 0,
	duration: 200
});

anRemBoxBuscar.addEventListener("start", function(e){
	$.trigger("fecharBuscar", {});
});

anRemBoxBuscar.addEventListener("complete", function(e){
	$.boxTopBar.remove(boxBuscar);
	$.boxBotoes.add(btnBuscar);
});

/**
 * @method iniciar
 * Construtor da classe. Altera o título e caso exista uma janela anterior, a barra substitui o ícone de lista para o ícone voltar.
 * Adiciona também o evento de swipe na lateral esquerda da tela. 
 * @param {Object} titulo
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
$.iniciar = function(titulo){
	try{
		if(Alloy.Globals.currentWindow()){
			if(Alloy.Globals.currentWindow()._previousWin){
				$.boxListaServico.setBackgroundImage("/images/voltar.png");	
			}
		}
		$.titulo.text = titulo;
		
		var camadaTeste = Ti.UI.createView({
			zIndex: 10,
			width: 25,
			left: 0,
			height: Ti.UI.FILL,
			top: 50
		});
		
		camadaTeste.addEventListener("swipe", function(e){
			if(e.direction === 'right'){
				$.boxListaServico.fireEvent("click", {source: $.boxListaServico});
			}
		});
		
		Alloy.Globals.currentWindow().add(camadaTeste);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "iniciar", "app/widgets/GUI/controllers/Topbar.js");
	}
};

/**
 * @method addRightButtom
 * Adiciona um botão no canto superior direito da tela.
 * @param {String} icon Url do icone.
 * @param {Function} callback Função executada quando se clica no botão.
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
$.addRightButtom = function(icon, callback){
	var btnRight = Ti.UI.createButton({
		right: gapDireitaBotao + ($.boxBotoes.children.length * (tamanhoBotao + gapDireitaBotao)),
		width: tamanhoBotao,
		height: tamanhoBotao,
		backgroundColor: 'transparent',
		backgroundImage: icon,
		backgroundSelectedColor: Alloy.Globals.MainColorLight
	});
	btnRight.addEventListener("click", callback);
	$.boxBotoes.add(btnRight);
	return btnRight;
};

/**
 * @method enableSmartFilter
 * Ativa o filtro inteligente para a lista.
 * @param {Ti.UI.TableView} tableView Tabela a ser filtrada.
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
$.enableFilter = function(controller){
	
	btnBuscar = $.addRightButtom("/images/lupa_white.png", callback);
	montarSearchBar({controller: controller});
	function callback(e){
		$.trigger("abrirBuscar", {});
		$.boxBotoes.remove(btnBuscar);
		$.boxTopBar.add(boxBuscar);
		sField.focus();
		//boxBuscar.animate(anAddBoxBuscar);
	}
	
	boxBuscar.addEventListener("fechar", function(e){
		//boxBuscar.animate(anRemBoxBuscar);
		$.trigger("fecharBuscar", {});
		$.boxTopBar.remove(boxBuscar);
		$.boxBotoes.add(btnBuscar);
	});
};

$.removeButton = function(index){
	var ret = $.boxBotoes.children[index];
	$.boxBotoes.remove($.boxBotoes.children[index]);
};

$.removeAll = function(){
	var ret = [];
	while($.boxBotoes.children.length > 0){
		ret.push($.boxBotoes.children[0]);
		$.boxBotoes.remove($.boxBotoes.children[0]);
	}
	return ret;
};

$.addOldButton = function(buton){
	$.boxBotoes.add(buton);
};

function montarSearchBar(parans){
	sField = Ti.UI.createTextField({
		backgroundColor: "transparent",
		enableReturnKey: true,
		returnKeyType: Titanium.UI.RETURNKEY_SEARCH,
		font: {fontSize: 22},
		hintText: "Buscar...",
		left: 38,
		right: 38,
		top: 0,
		height: Ti.UI.FILL
	});
	var btnLimpar = Ti.UI.createButton({
		backgroundColor: 'transparent',
		backgroundImage: "/images/x.png",
		visible: false,
		enabled: false,
		height: 32,
		width: 32,
		right: 4,
		backgroundSelectedColor: Alloy.Globals.MainColorLight
	});
	btnLimpar.addEventListener("click", function(e){
		sField.value = "";
		btnLimpar.enabled = false;
		btnLimpar.visible = false;
	});
	
	var btnFechar = Ti.UI.createButton({
		width: 32,
		height: 32,
		left: 4,
		backgroundImage: "/images/voltar_main.png",
		backgroundColor: "transparent",
		backgroundSelectedColor: Alloy.Globals.MainColorLight
	});
	
	btnFechar.addEventListener("click", function(){
		sField.setValue("");
		parans.controller.trigger("buscar", {texto: ""});
		boxBuscar.fireEvent("fechar", {});
	});
	
	sField.addEventListener("change", function(e){
		if(e.value.length > 0){
			btnLimpar.enabled = true;
			btnLimpar.visible = true;
		}
		parans.controller.trigger("buscarchange", {texto: e.value});
	});
	sField.addEventListener("return", function(e){
		parans.controller.trigger("buscar", {texto: e.value});
		sField.blur();
	});
	
	boxBuscar = Ti.UI.createView({
		height: Ti.UI.FILL,
		width: Ti.UI.FILL,
		//borderRadius: 12,
		backgroundColor: "white"
	});
	boxBuscar.add(sField);
	boxBuscar.add(btnLimpar);
	boxBuscar.add(btnFechar);
}

/**
 * @event click_boxListaServico
 * Disparado ao se clicar no ícone de lista. Caso exista uma janela anterior, esta janela será fechada e a anterior será aberta.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
$.boxListaServico.addEventListener("click", function(e){
	if(Alloy.Globals.currentWindow()._previousWin){
		Alloy.createWidget("Util", "Transicao").anterior();
	}
	else{
		Alloy.Globals.ListaServicos.abrir();
	}
});
