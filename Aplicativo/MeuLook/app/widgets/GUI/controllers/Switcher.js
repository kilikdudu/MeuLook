/**
 * @class widgets.GUI.Switcher
 * Switcher personalizado.
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
var args = arguments[0] || {};

/**
 * @method getValue
 * Retorna o valor do switcher.
 * @returns {Boolean}
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.getValue = function(){
	if($.carro.text === "Sim"){
		return true;
	}
	else{
		return false;
	}
};

/**
 * @method setValue
 * Altera o valor do switcher.
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.setValue = function(value){
	if(value){
		$.carro.animate(animacaoSim);
	}
	else{
		$.carro.animate(animacaoNao);
	}
};

/**
 * @property {Ti.UI.Animation} animacaoSim Animação do botão ao se transformar em "Sim".
 * @private
 */
var animacaoSim = Ti.UI.createAnimation({
	right: 0,
	left: 25,
	duration: 100
});

animacaoSim.addEventListener("complete", function(e){
	$.carro.setText("Sim");
	$.carro.setColor("white");
	$.carro.setBackgroundColor(Alloy.Globals.MainColor);
	$.getView().fireEvent("change", {value: true});
});

/**
 * @property {Ti.UI.Animation} animacaoNao Animação do botão ao se transformar em "Não".
 * @private
 */
var animacaoNao = Ti.UI.createAnimation({
	left: 0,
	right: 25,
	duration: 100
});

animacaoNao.addEventListener("complete", function(e){
	$.carro.setText("Não");
	$.carro.setColor(Alloy.Globals.MainColor);
	$.carro.setBackgroundColor("#B6B6B6");
	$.getView().fireEvent("change", {value: false});
});

$.carro.addEventListener("click", function(e){
	if($.carro.text === "Sim"){
		$.carro.animate(animacaoNao);
	}
	else{
		$.carro.animate(animacaoSim);
	}
});

$.carro.addEventListener("swipe", function(e){
	if(e.direction === 'right'){
		$.carro.animate(animacaoSim);
	}
	if(e.direction === 'left'){
		$.carro.animate(animacaoNao);
	}
});