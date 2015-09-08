/**
 * @class widgets.WebService.HttpRequest
 * @private
 * Faz solicitações http.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
var args = arguments[0] || {};

/**
 * @property
 * @private
 * Url do serviço.
 * @type {String}
 */
var url = args.url;
/**
 * @property
 * @private
 * Time out da requisição.
 * @type {Number}
 */
var timeout = args.timeout;
/**
 * @property
 * @private
 * GET ou POST.
 * @type {widgets.GUI.Camada}
 */
var metodo = args.metodo;
/**
 * @property
 * @private
 * Função executada caso a requisição seja bem-sucedida.
 * @type {Function}
 */
var sucessCallback = args.callback || function(e){alert('Sucesso');};
/**
 * @property
 * @private
 * Função executada caso ocorra erro na requisição.
 * @type {Function}
 */
var errorCallback = args.error || function(e){alert('error');};
/**
 * @property
 * @private
 * Caso seja passada como parâmetro, a mesma é populada com os dados obtidos pela requisição. Caso não seja passada uma nova coleção é criada.
 * @type {BackBone.Collection}
 */
var colecao = args.colecao || null;
/**
 * @property
 * @private
 * Caso a classe crie uma nova coleção, essa configuração será usada na nova BackBone.Collection.
 * @type {BackBone.Options}
 */
var collectionConfig = args.colletionConfig || {};
/**
 * @property
 * @private
 * Armazena os dados que serão enviados pela requisição.
 * @type {Object}
 */
var dados = null;

/**
 * @method 
 * Adiciona os dados que serão enviados pela requisição.
 * @param {JSONObject} parametro
 * @returns {null}
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.adicionaParametro = function(parametro){
	dados = parametro;	
};

/**
 * @method
 * Executa a requisição.
 * Ao final da requisição, as funções de sucessCallback ou errorCallback serão ativadas.
 * Caso a função de sucessCallback seja executada, a coleção gerada ou populada será passada como parâmetro.
 * Caso a função de errorCallback seja executada, o erro é retornado como parâmetro.
 * @param {JSONObject} parans Configurações da requisição.
 * @param {Boolean} parans.outArch Indica se o webService está fora da arquitetura mobile WebAPI
 * @returns {null} 
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.NovoEnvia = function(parans){
	try{
		var client = Ti.Network.createHTTPClient({
		    onload : function(e){
		    	if(this.responseText == null){
		    		sucessCallback();
		    		return ;
		    	}
		    	var jsonText = this.responseText;
				var json = JSON.parse(jsonText);
				if(colecao){
					Alloy.Globals.DAL.refreshColecao(colecao, json);	
				}
				else{
					colecao = Alloy.Globals.DAL.criarColecao(json, collectionConfig);
				}
		    	sucessCallback(colecao);
		    },
		    onerror : function(e){
		    	errorCallback(e);
		    },
		    timeout : args.timeout
		});
		Envia(client);	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "NovoEnvia", "app/widgets/WebService/controllers/HttpRequest.js");
	}
};
function Envia(cliente){
	cliente.open(metodo, url);
	cliente.setRequestHeader("Content-Type","application/json");
	cliente.send(JSON.stringify(dados));
}