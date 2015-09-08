/**
 * @class widgets.GUI.LblTextField
 * Componente para entrada de texto personalizado.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

$.lblNovoNome.text = args.nome;

/**
 * @method
 * Construtor da classe.
 * @param {Object} parans Configurações do textInput
 * @param {String} parans.nome Título do texto input.
 * @param {widgets.GUI.LblTextField} parans.next Próximo input a receber o foco.
 * @alteracao 18/05/2015 187463 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.init = function(parans){
	if(parans.nome){
		$.lblNovoNome.text = parans.nome;
	}
	if(parans.keyboardType){
		$.novoNome.setKeyboardType(parans.keyboardType);
	}
	if(parans.next){
		$.novoNome.setReturnKeyType(Ti.UI.RETURNKEY_NEXT);
		$.novoNome.addEventListener("return", function(e){
			parans.next.selecionar();
		});
		
		if(parans.keyboardType == Titanium.UI.KEYBOARD_NUMBER_PAD && Ti.Platform.name === 'iPhone OS'){
			var flexSpace = Titanium.UI.createButton({
			    systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
			});
			var proximo = Titanium.UI.createButton({
			    title: 'Seguinte',
			    style: Titanium.UI.iPhone.SystemButtonStyle.DONE,
			});
			proximo.addEventListener("click", function(e){
				parans.next.selecionar();
			});
			var toolbar = Titanium.UI.iOS.createToolbar({
			    items:[flexSpace, proximo]
			});
			$.novoNome.keyboardToolbar = toolbar;
		}
		
	}else{
		$.novoNome.setReturnKeyType(Ti.UI.RETURNKEY_DONE);
		$.novoNome.addEventListener("return", function(e){
			$.novoNome.blur();
		});
	}
	return null;
};

/**
 * @method
 * Pega o texto inserido.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * @return {String}
 */
$.getInputValue = function(){
	return $.novoNome.value;
};

/**
 * @method setDesc
 * Altera o título.
 * @param {Object} desc
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.setDesc = function(desc){
	$.lblNovoNome.text = desc;
};

/**
 * @method setInputValue
 * Altera o valor do input. 
 * @param {String} value
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.setInputValue = function(value){
	$.novoNome.value = value;
};

/**
 * @method desfocar
 * Retira o foco do controle.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.desfocar = function(){
	$.novoNome.blur();
};

/**
 * @method selecionar
 * Coloca o foco no text input.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.selecionar = function(){
	$.novoNome.focus();
};

$.setEnabled = function(status){
	if(!status){
		$.linha.backgroundColor = "transparent";
		$.novoNome.color = "#505050";
		$.novoNome.enabled = false;
	}else{
		$.linha.backgroundColor = "black";
		$.novoNome.color = "black";
		$.novoNome.enabled = true;
	}
};

$.novoNome.addEventListener('focus', function() {
    $.linha.setBackgroundColor(Alloy.Globals.MainColorLight);
});
  
$.novoNome.addEventListener('blur', function() {
	$.linha.setBackgroundColor("black");
	$.trigger('blur', {
		source: $.novoNome,
		text:  $.novoNome.value
	});
});