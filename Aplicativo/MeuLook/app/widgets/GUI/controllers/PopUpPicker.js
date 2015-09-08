/**
 * @class widgets.GUI.PopUpPicker
 * Picker apresentado em uma pop up.
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

/**
 * @property {Function} clickCallback Função de callback ao selecionar a data.
 */
var clickCallback = null;

/**
 * @property {Date} currentValue Data atual.
 */
var currentValue = new Date();

/**
 * @method init
 * Construtor da classe.
 * @param {Object} titulo Titulo da popup
 * @param {Object} value Valor que aparecera inicialmente.
 * @param {Object} hasCancel Se possuí botão cancelar.
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.init = function(titulo, value, hasCancel){
	try{
		$.titulo.setText(titulo || "Alerta");
		if(value){
			$.picker.setValue(value);
			currentValue = value;
		}
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
 * @method showFunction
 * Rotina executada ao abrir o picker. 
 * @param {Object} parans Parâmetros
 * @param {Function} parans.callback Função execuatada ao se selecionar a data.
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
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

/**
 * @method clickOk 
 * Invocada ao clicar em ok.
 * @private
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function clickOk(){
	$.close();
	if(clickCallback){
		clickCallback({flag: true, valor: currentValue});
	}
}

/**
 * @method clickCancel 
 * Invocada ao cancelar a seleção.
 * @private
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function clickCancel(e){
	$.close();
	if(clickCallback){
		clickCallback({flag: false, valor: currentValue});
	}
}

/**
 * @method alteraValor
 * Altera o valor sempre que a data for alterada no picker.
 * @param {Object} e Parâmetros.
 * @param {String} e.value Novo valor.
 * @private
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function alteraValor(e){	
	currentValue = new Date(e.value);
}
