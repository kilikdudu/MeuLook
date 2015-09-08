/**
 * @class widgets.GUI.RadioGroup
 * Controle de radio button.
 * @alteracao 09/07/2015 191657 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

/**
 * @property {Object} listControl Lista de controles no componente.
 */
var listControl = [];
/**
 * @property {Number} selectedIndex controle selecionado.
 */
var selectedIndex = 0;

/**
 * @method start
 * Inicia o componente.
 * @private
 * @alteracao 09/07/2015 191657 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function start(){
	$.groupTitle.setText(args.titulo);
	$.getView().width = args.width;
	$.getView().height = args.height;
}

/**
 * @method setGroup
 * Adiciona os controles no grupo.
 * @param {Object} colecao Vetor contendo os titulos dos controles.
 * @param {Object} index Indice do controle que inicia ativado.
 * @alteracao 09/07/2015 191657 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.setGroup = function(colecao, index){
	if(index){
		selectedIndex = index;
	}
	for(var i = 0; i < colecao.length; i++){
		var container = Ti.UI.createView({
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE,
			layout: 'horizontal',
			top: i>0?5:0,
			left: "5%"
		});
		var sty = $.createStyle({
			classes: ["meuSwitch"],
			apiName: 'Switch'
		});
		var archSwitch = Ti.UI.createSwitch({
			value: i==selectedIndex?true:false,
			index: i
		});
		archSwitch.applyProperties(sty);
		container.add(archSwitch);
		var lblDesc = Ti.UI.createLabel({
			text: colecao[i],
			left: 7
		});
		container.add(lblDesc);
		$.listaSwitch.add(container);
		
		listControl.push({index: i, source: archSwitch, title: colecao[i]});
		
		archSwitch.addEventListener("change", function(e){
			if(e.value == false && e.source.index == selectedIndex){
				e.source.value = true;
				return;
			}
			if(e.source.index != selectedIndex && e.value == true){
				var tempIndex = selectedIndex;
				selectedIndex = e.source.index;
				listControl[tempIndex].source.value = false;
				$.trigger('change', $.getSelected());
				return;
			}
		});
		
	}
};

/**
 * @method getSelected
 * Pega o indice do controle selecionado
 * @return {Object} Item Retorno
 * @return {Number} return.index Indice do controle selecionado.
 * @return {String} return.title Texto do controle.
 * @return {Object} return.source Controle selecionado. 
 * @alteracao 09/07/2015 191657 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.getSelected = function(){
	return {index: selectedIndex, title: listControl[selectedIndex].title, source: listControl[selectedIndex].source};
};

//Inicio o componente.
start();
