/**
 * @class widgets.GUI.DateInput
 * Input de data personalizado.
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

/**
 * @property {widgets.GUI.PopUpPicker} picker Picker de data
 */
var picker = Widget.createWidget("GUI", "PopUpPicker");


/**
 * @method init
 * Construtor da classe.
 * @param {Object} parans Parâmetros
 * @param {String} parans.nome Descrição do input.
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.init = function(parans){
	try{
		$.lblDesc.text = parans.nome;
		picker.init($.lblDesc.text, new Date(), true);	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/widgets/GUI/controllers/ComboBox.js");
	}
};

/**
 * @method setDesc
 * Altera o título do input.
 * @param {String} desc Novo título.
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.setDesc = function(desc){
	$.lblDesc.text = desc;
};

/**
 * @method abrirPicker
 * Abre o picker de data.
 * @private
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function abrirPicker(){
	picker.show({callback: $.setSelected});	
};

/**
 * @method selecionar
 * Da foco no componente e abre o picker de data
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.selecionar = function(){
	abrirPicker();
};

/**
 * @method getSelected
 * Retorna a data selecionada.
 * @return {Object} Data selecionada
 * @return {String} return.data Data no formato dd/mm/yyyy.
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.getSelected = function(){
	var retorno = {data: $.selectedDate.text};
	return retorno;
};

/**
 * @method setSelected
 * Altera o valor do input.
 * Dispara o evento change.
 * @param {Object} parans
 * @param {String} parans.valor Nova data.
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.setSelected = function(parans){
	$.selectedDate.text = Alloy.Globals.format.toDiaMesAno(parans.valor);
	$.trigger('change', {
    	source: $.selectedDate,
    	data: $.selectedDate.text
  	});
};

/**
 * @event change
 * Disparado quando o valor do input é alterado.
 * @return {Object} Valor retornado.
 * @return {Object} return.source Controle do input.
 * @return {String} return.data Data que está informada no controle.
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */