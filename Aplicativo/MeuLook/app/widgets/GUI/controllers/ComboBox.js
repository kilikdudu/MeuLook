/**
 * @class widgets.GUI.ComboBox
 * ComboBox personalizada.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * 
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Alterado para aceitar uma lista padrão de registros.
 * 
 */
var args = arguments[0] || {};

/**
 * @property {String} keyColumn Nome da coluna chave da coleção.
 * @private
 */
var keyColumn = null;

/**
 * @property {widgets.GUI.PopUpList} lista Controller da lista apresentada ao listar a ComboBox
 * @private
 */
var lista = Widget.createWidget("GUI", "PopUpList");

/**
 * @property {Function} funcAdd Rotina executada ao se clicar em Adicionar.
 * @private
 */
var funcAdd = null;

/**
 * @property {Function} showFunction Rotina executada antes de abrir e mostrar e lista.
 * @private 
 */
var showFunction = null;

/**
 * @method init
 * Construtor da classe. 
 * @param {Object} parans Configurações da ComboBox
 * @param {String} parans.nome título da combobox
 * @param {Function} parans.addFunc Referência utilizada por widgets.GUI.ComboBox.funcAdd
 * @param {Array} parans.chave Vetor de chaves que conseguem identificar unicamente o registro.
 * @param {BackBone.Collection} parans.colecao Coleção vinculada a listagem da combobox
 * @param {String} parans.coluna Coluna da coleção que será exibida na listagem.
 * @param {Function} parans.showFunction Rotina que será executada antes de abrir a lista de registros.
 * @param {Function} parans.filterHandler Rotina executada após executar o filtro nos registros.
 * @param {Object} parans.defaultData Lista de registros padrão. Inicialmente apenas esses registros serão mostrados, após uma busca os demais serão mostrados.
 * @param {String} parans.mensagem Mensagem que será exibida quando não existe nenhum registro a ser apresentado na lista.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * 
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Alterado para aceitar uma lista padrão de registros.
 * 
 */
$.init = function(parans){
	try{
		$.lblDesc.text = parans.nome;
		
		if(parans.addFunc){
			funcAdd = parans.addFunc;
			
			$.selectedDesc.setRight(90);
			$.linhaDesc.setRight(90);
			$.btList.setRight(45);
			
			var btAdd = Ti.UI.createButton({
				width: Alloy.Globals.CustomComponentHeight,
				height: Alloy.Globals.CustomComponentHeight,
				right: 0,
				backgroundImage: "/images/add.png",
				backgroundSelectedColor: "#E6E6E6",
				borderRadius: 4
			});
			btAdd.addEventListener("click", btAddFunc);
			$.boxControles.add(btAdd);
		}
		
		if(parans.showFunction){
			showFunction = parans.showFunction;
		}
		
		keyColumn = parans.chave;
		lista.init($.lblDesc.text, parans.colecao, parans.chave, parans.coluna, $.setSelected, parans.filterHandler, parans.defaultData, parans.mensagem, handlerLongClick);	
		lista.getView().addEventListener("atualizou", checkInput);
		return null;
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/widgets/GUI/controllers/ComboBox.js");
	}
};

/**
 * @method setDefaultData
 * Altera a lista de registros padrão.
 * @param {Object} data Nova coleção.
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.setDefaultData = function(data){
	lista.setDefaultData(data);
};

/**
 * @event handlerLongClick 
 * Disparada quando se segura o dedo em cima do registro.
 * @param {Object} e Objeto do evento.
 * @param {String} e.title Descrição do registro.
 * @param {Array} e.chave Vetor de chaves do registro.
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function handlerLongClick(e){
	$.trigger("listlngclick", e);
};

/**
 * @event checkInput 
 * Rotina executada quando a coleção vinculada a lista é atualizada.
 * @param {Object} param Resposta do evento.
 * @param {BackBone.Collection} colecao Nova coleção.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function checkInput(param){
	var flagCount = 0;
	var flag = false;
	if($.selectedDesc.chave !== null){
		for(var i = 0; i < param.colecao.length; i++){
			flagCount = 0;
			for(var j = 0; j < $.selectedDesc.chave.length; j++){
				if(param.colecao[i][keyColumn[j]] === $.selectedDesc.chave[j]){
					flagCount++;
				}	
			}
			if(flagCount > 0){
				flag = true;
				break;
			}
		}
		if(!flag){
			$.selectedDesc.chave = "";
			$.selectedDesc.text = "";
		}
	}
}

/**
 * @method refreshList
 * Atualiza manualmente a lista vinculada.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.refreshList = function(){
	try{
		lista.refresh();
	}
	catch(e){
		Alloy.Globals.onError(e.message, "refreshList", "app/widgets/GUI/controllers/ComboBox.js");
	}
};

/**
 * @method selecionar
 * Abre a lista da combobox.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.selecionar = function(){
	$.btList.fireEvent("click", {source: $.btList});
};

/**
 * @method getSelected
 * Pega as informações do item selecionado na lista da combobox
 * @return {Object} Item selecionado
 * @return {String} return.texto Descrição do item selecionado.
 * @return {String} return.chave Chave do item selecionado.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.getSelected = function(){
	var retorno = {texto: $.selectedDesc.text, chave: $.selectedDesc.chave};
	return retorno;
};

/**
 * @method setSelected
 * Altera o item selecionado manualmente.
 * @param {String} texto Descrição.
 * @param {String} chave Chave que identifica o item.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.setSelected = function(texto, chave){
	$.selectedDesc.text = texto;
	$.selectedDesc.chave = chave;
	$.trigger("change", {
		text: texto,
		chave: chave
	});
};

/**
 * @event listar
 * Execuatada quando o botão listar é clicado.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function listar(){
	try{
		if(showFunction){
			showFunction({show: lista.show});
		}else{
			lista.show();	
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "listar", "app/widgets/GUI/controllers/ComboBox.js");
	}
}

/**
 * @event btAddFunc
 * Executada quando o botão adicionar é clicado.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function btAddFunc(){
	try{
		funcAdd();
	}
	catch(e){
		Alloy.Globals.onError(e.message, "btAddFunc", "app/widgets/GUI/controllers/ComboBox.js");
	}
}
