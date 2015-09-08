/**
 * @class widgets.GUI.LblHtml
 * Label com tags html.
 * Apresenta os dados no formato [Descrição][Valor].
 * @alteracao 20/07/2015 183484 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
var args = arguments[0] || {};

/**
 * @property {Number} tamanhoFonte Tamanho da fonte no html.
 * @private
 */
var tamanhoFonte = args.tamanhoFonte || (Alloy.isHandheld?16:24);
/**
 * @property {String} descColor Cor da descrição da label.
 * @private
 */
var descColor = args.descColor || Alloy.Globals.MainColor;
/**
 * @property {String} valueColor Cor do valor da label.
 * @private
 */
var valueColor = args.valueColor || "#505050";
/**
 * @property {String} descText Descrição da label. 
 * @private
 */
var descText = args.descText || "";
/**
 * @property {String} valueText Valor da label. 
 * @private
 */
var valueText = args.valueText;

args.html = "<font size=" + tamanhoFonte + " color=" + descColor + ">" + descText + "</font><font color=" + valueColor + " size=" + tamanhoFonte + ">" + valueText + "</font>";
$.htmlLabel.applyProperties(args);

/**
 * @method setValueText
 * Altera o valor da label.
 * @param {String} value Valor da label.
 * @alteracao 20/07/2015 183484 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
$.setValueText = function(value){
	valueText = value;
	args.html = "<font size=" + tamanhoFonte + " color=" + descColor + ">" + descText + "</font><font color=" + valueColor + " size=" + tamanhoFonte + ">" + valueText + "</font>";
	$.htmlLabel.applyProperties(args);	
};
