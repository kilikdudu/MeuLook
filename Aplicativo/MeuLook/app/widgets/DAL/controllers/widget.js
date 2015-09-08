/**
 * @class widgets.DAL.widget
 * DAL
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
/**
 * @method criarColecao
 * Cria uma nova BackBone.Collection apenas em memória.
 * @param {JSONObject} json JSONObject contendo os dados.
 * @param {BackBone.Options} config Configurações que serão consideradas no BackBone.Collection. 
 * @returns {BackBone.Collection}
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.criarColecao = function(json, config){
	try{
		var colecao = Backbone.Collection.extend(config);
		var novaColecao = new colecao(json);
		return novaColecao;
	}
	catch(e){
		Alloy.Globals.onError(e.message, "criarColecao", "app/widgets/DAL/controllers/widget.js");
	}	
};

/**
 * @method destroyColecao
 * Apaga os dados da coleção do SQLite.
 * @param {BackBone.Collection} colecao Coleção a ser deletada. (Apenas Coleções que persistem no SQLite) 
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.destroyColecao = function(colecao){
	try{
		while(colecao.length > 0){
			colecao.at(0).destroy({silent: true});
		}
		colecao.fetch();                                
	}
	catch(e){
		Alloy.Globals.onError(e.message, "destroyColecao", "app/widgets/DAL/controllers/widget.js");
	}
};

/**
 * @method refreshColecao
 * Atualiza a BackBone.Collection. Apenas Coleções que não persistem no SQLite.
 * @param {BackBone.Collection} colecao Apenas coleções que não persistem no SQLite.
 * @param {JSONObject} json Dados a serem inseridos na coleção.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.refreshColecao = function(colecao, json){
	try{
		colecao.reset();
		colecao.add(json, {silent: true});                                  
	}
	catch(e){
		Alloy.Globals.onError(e.message, "refreshColecao", "app/widgets/DAL/controllers/widget.js");
	}
};
