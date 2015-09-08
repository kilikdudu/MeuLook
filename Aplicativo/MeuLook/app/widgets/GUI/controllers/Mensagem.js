/**
 * @class widgets.GUI.Mensagem
 * Popup com mensagem e título.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

/**
 * @property {Function} clickCallback Função executada ao se confirmar a popup.
 * @private
 */
var clickCallback = null;

var tempo = Ti.UI.createLabel({
	text: 0,
	font: {fontSize: Alloy.Globals.CustomTitleFont},
	color: Alloy.Globals.MainColor,
	left: 5
});

var intervalo = null;

/**
 * @method init
 * Construtor da classe
 * @param {String} titulo Título da popup.
 * @param {String} mensagem Mensagem da popup.
 * @param {Boolean} [hasCancel] Indica se o botão cancelar vai ser apresentado.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.init = function(titulo, mensagem, hasCancel){
	try{
		$.titulo.setText(titulo || "Alerta");
		$.texto.setText(mensagem);
		if(hasCancel){
			$.btnOk.width = "40%";
			$.btnOk.left = "5%";
			$.btnCancel.setEnabled(true);
			$.btnCancel.width = "40%";
			$.btnCancel.right = "5%";
		}
		Alloy.Globals.configPopUp($, $.showFunction);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/widgets/GUI/controllers/Mensagem.js");
	}
};

/**
 * @event showFunction
 * Executado quando o controller executa a funcao show.
 * @param {Object} parans Configuração da popup ao ser apresentada.
 * @param {Function} [parans.callback] Referencia a widgets.GUI.Mensagem.clickCallback 
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.showFunction = function(parans){
	try{
		if(parans){
			clickCallback = parans.callback || null;	
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "show", "app/widgets/GUI/controllers/Mensagem.js");
	}
};

$.addCronometroRegressivo = function(timeout){
	var boxCronometro = Ti.UI.createView({
		width: 72,
		height: 38,
		right: 0,
		layout: "horizontal"
	});
	var loader = Ti.UI.createImageView({
		width: 32,
		height: 32
	});
	Alloy.createWidget("Util", "Animation").loaderAnimation(loader);
	boxCronometro.add(loader);
	tempo.text = timeout;
	intervalo = setInterval(setCronometro, 1000);
	boxCronometro.add(tempo);
	$.boxTitulo.add(boxCronometro);
};

function setCronometro(){
	var novo = parseInt(tempo.text) - 1;
	if(novo <= 0){
		clickCancel();
		clearInterval(intervalo);
	}
	else{
		tempo.text = novo.toString();	
	}
}

/**
 * @event clickOK
 * Evento disparado ao se clicar em ok na popup.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function clickOk(){
	$.close();
	clearInterval(intervalo);
	if(clickCallback){
		clickCallback({value: true, source: $});
	}
}

/**
 * @event clickCancel
 * Evento disparado ao se clicar em cancelar na popup.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function clickCancel(e){
	$.close();
	clearInterval(intervalo);
	if(clickCallback){
		clickCallback({value: false, source: $});
	}
}