/**
 * @class widgets.WebService.widget
 * Inicia objetos para requisições remotas. 
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

/**
 * @property
 * @private
 * Camada adicionada a tela.
 * @type {widgets.GUI.Camada}
 */
var semLoader = false;

/**
 * @method
 * Inicia um requisição http.
 * @param {Object} param Configuração da requisição.
 * @param {String} param.url Endereço o serviço requisitado.
 * @param {String} param.metodo GET ou POST.
 * @param {Number} [param.timeout] Time out da requisição.
 * @param {Function} param.callback Função executada caso a requisição seja bem-sucedida.
 * @param {Function} param.error Função executada caso ocorra algum erro na requisição.
 * @param {BackBone.Collection} [param.colecao]  Caso seja passado, a rotina irá popular a colecao com os dados retornados da requisicao.
 * @param {BackBone.Options} [param.collectionConfig] Só é considerado quando o parâmetro colecao é omitido, configura a BackBone.Collection gerada pela classe widgets.WebService.HttpRequest.
 * @returns {widgets.WebService.HttpRequest} 
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.iniciarHttpRequest = function(param)
{
	try{
		if(!Alloy.Globals.estaOnline){
			Alloy.Globals.Alerta("Sem conexão", "Você não está conectado a internet. Se conecte e então tente novamente.");
			return ;
		}
		var funcaoRetornoS = function(ret){
			param.callback(ret);
			if(!semLoader){
				Alloy.Globals.carregou();
			}
		};
		var funcaoRetornoN = function(ret){
			param.error(ret);
			if(!semLoader){
				Alloy.Globals.carregou();	
			}
		};
		var varHttpRequest = Widget.createController("HttpRequest",{ 
			url: param.url, 
			metodo: param.metodo, 
			callback: funcaoRetornoS,
			error: funcaoRetornoN,
			timeout: param.timeout,
			colecao: param.colecao,
			collectionConfig: param.collectionConfig,
			headerType: param.headerType
		});
		if(!param.semLoader){
			Alloy.Globals.carregando();
		}
		return varHttpRequest;
	}
	catch(e){
		Alloy.Globals.onError(e.message, "iniciarHttpRequest", "app/widgets/WebService/controllers/widget.js");
	}
};
