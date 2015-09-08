/**
 * @class widgets.GUI.PopUpList
 * Component  de lista em forma de popup.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * 
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Alterado para aceitar uma lista padrão de registros.
 * 
 */
var args = arguments[0] || {};

/**
 * @property {String} dataColumn Coluna da coleção que será exibida na lista. 
 */
var dataColumn = null;
/**
 * @property {String} chaveColumn Coluna chave da coleção. 
 */
var chaveColumn = null;
/**
 * @property {BackBone.Collection} refColecao Referência para a coleção vinculada a lista. 
 */
var refColecao = null;
/**
 * @property {Function} meuCallback Rotina executada quando se seleciona um item da lista.  
 */
var meuCallback = null;
/**
 * @property {Object} selectedRow Linha selecionada. Veja a documentação do Titanium para Ti.UI.TableViewRow.
 * @property {String} selectedRow.text Descrição da linha selecionada.
 * @property {String} selectedRow.chave Chave da linha selecionada.  
 */
var selectedRow = null;

/**
 * @property {Function} filterExtend Rotina executada após o filtro e antes de mostrar os registros filtrados.
 */
var filterExtend = null;

/**
 * @property {Function} defaultData Lista de registros padrão. Inicialmente apenas esses registros serão mostrados, após uma busca os demais serão mostrados.
 */ 
var defaultData = undefined;

/**
 * @property {Function} longPressFunction Lista de registros padrão. Inicialmente apenas esses registros serão mostrados, após uma busca os demais serão mostrados.
 */
var longPressFunction = null;

/**
 * @property {Boolean} cancelClick Flag utilizada para bloquear o evento de click durante o evento de longpress.
 */
var cancelClick = false;

//A barra de pesquisa não diferencia maiusculas de minusculas.
$.listaPopUp.setFilterCaseInsensitive(true);
$.listaPopUp.setFilterAttribute("title");

/**
 * @method preencher
 * Preenche a lista com os dados contidos na coleção passada.
 * @param {BackBone.Collection} dados Coleção que se deseja vincular a lista.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * 
 */
function preencher(dados){
	try{
		//deselecionarRow();
		var tableData = [];
		for(var i = 0; i < dados.length; i++)
		{
			var chaveRow = [];
			//Monto a coleção de chaves para atribuir ao registro.
			for(var j = 0; j < chaveColumn.length; j++){
				chaveRow.push(dados.at(i).get(chaveColumn[j]));
			}
			var tvRow = Ti.UI.createTableViewRow({
				width: Titanium.UI.FILL,
				height: 40,
				title: dados.at(i).get(dataColumn),
				chave: chaveRow,
				color: "white",
				selectedBackgroundColor: "transparent",
				className: "PopUpListRow"
			});
			var texto = Ti.UI.createLabel({
				text: dados.at(i).get(dataColumn),
				color: "black",
				textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
				width: Titanium.UI.FILL,
				height: 25,
				backgroundColor: "white",
				wordWrap: false,
				ellipsize: true
			});
			tvRow.add(texto);
			var linha = Ti.UI.createView({
				height: Alloy.isHandheld?0.5:1,
				backgroundImage: "/images/linhaBlack.png", 
				width: "90%",
				left: "5%",
				bottom: 1
			});
			tvRow.add(linha);
			tvRow.lblTexto = texto;
			tvRow.lin = linha;
			tableData.push(tvRow);
		}
		$.listaPopUp.setData(tableData);
		if(tableData.length == 0){
			$.listaPopUp.setOpacity(0);
			$.lblEmpty.setOpacity(1);
		}else{
			$.listaPopUp.setOpacity(1);
			$.lblEmpty.setOpacity(0);
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "preencher", "app/widgets/GUI/controllers/PopUpList.js");
	}
}

/**
 * @method setColecao 
 * Vincula uma nova coleção a lista.
 * @param {BackBone.Collection} novaColecao Nova coleção a ser vinculada.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.setColecao = function(novaColecao){
	refColecao = novaColecao;
	refColecao.on("change", $.refresh);
	checkRefresh();
};

/**
 * @method refresh
 * Atualiza a lista de acordo com a coleção.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.refresh = function(){
	checkRefresh();
	$.getView().fireEvent("atualizou", {colecao: refColecao.toJSON()});
};

/**
 * @method checkRefresh
 * Verifica como deve atualizar a lista de registros.
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function checkRefresh(){
	var strFiltro = $.schBusca.getValue();
	//Se está aplicando filtro.
	if(strFiltro.length > 0){
		buscar({value: strFiltro});
	}
	//Se existe uma lista de registros padrão.
	else if(defaultData){
		defaultRegisters();
	}
	//Preenche a lista com todos os registros.
	else{
		preencher(refColecao);	
	}
}

/**
 * @method init
 * Construtor da classe. Realiza o vinculo a uma BackBone.Collection, toda vez que a coleção é atualizada a lista é regerada. 
 * Para evitar isso, utilize silence: true nas operações com a coleção.
 * @param {String} titulo título da lista
 * @param {BackBone.Collection} colecao Usado como referência por widgets.GUI.PopUpList.refColecao
 * @param {String} chave Usado como referência por widgets.GUI.PopUpList.chaveColumn
 * @param {String} coluna Usado como referência por widgets.GUI.PopUpList.chaveColumn
 * @param {Function} callback Usado como referência por widgets.GUI.PopUpList.meuCallback
 * @param {Function} filterHandler Rotina executada após executar o filtro nos registros.
 * @param {Object} defaultDataParam Lista de registros padrão. Inicialmente apenas esses registros serão mostrados, após uma busca os demais serão mostrados.
 * @param {String} emptyText Mensagem que será exibida quando não existe nenhum registro a ser apresentado na lista.
 * @param {Function} longpress Disparada ao segurar o dedo em cima do registro.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.init = function(titulo, colecao, chave, coluna, callback, filterHandler, defaultDataParam, emptyText, longpress){
	try{
		$.tituloPopUp.text = titulo;
		chaveColumn = chave;
		dataColumn = coluna;
		meuCallback = callback;
		refColecao = colecao;
		filterExtend = filterHandler;
		defaultData = defaultDataParam;
		longPressFunction = longpress;
		$.lblEmpty.setText(emptyText?emptyText:"");
		preencher(refColecao);
		refColecao.on("change", $.refresh);
		Alloy.Globals.currentWindow().addEventListener("close", function(e){
			refColecao.off("change", $.refresh);
		});
		Alloy.Globals.configPopUp($);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/widgets/GUI/controllers/PopUpList.js");
	}
};

/**
 * @event listaClick
 * Click na lista. Altera a propriedade widgets.GUI.PopUpLista.selectedRow [depredate]
 * @param {Ti.UI.TableViewRow} e 
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function listaClick(e){
    deselecionarRow();
    selectedRow = e.row;
    selectedRow.lblTexto.setColor(Alloy.Globals.MainColor);
	selectedRow.lin.setBackgroundImage("/images/linhaSelected.png");
	$.btnOk.setEnabled(true);
    var animacao = Ti.UI.createAnimation({
    	duration: 300,
    	opacity: 1
    });
    $.btnOk.animate(animacao);
}


/**
 * @event clickOk
 * Executa widgets.GUI.PopUpList.meuCallback e fecha a lista.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function clickOk(e){
	if(!cancelClick){
		meuCallback(e.row.title, e.row.chave);
		$.schBusca.tirarFoco();
		$.close();	
	}else{
		cancelClick = false;
	}
}

/**
 * @event clickCancelar
 * Fecha a lista.[depredate]
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function clickCancelar(e){
	$.close();
}

/**
 * @event longFunction
 * Disparada ao segurar o dedo em cima do registro. Executada a rotina longPressFunction.
 * @param {Object} e Parâmetros.
 * @param {Object} e.row Registro.
 * @param {String} e.row.title Descrição.
 * @param {Object} e.row.chave Vetor de chaves do registro.
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function longFunction(e){
	cancelClick = true;
	if(longPressFunction){
		longPressFunction({title: e.row.title, chave: e.row.chave});
	}
}

/**
 * @method deselecionarRow
 * Retorna a lista para o seu estado inicial.[depredate]
 * @private
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function deselecionarRow(){
	if(selectedRow !== null){
		selectedRow.lblTexto.setColor("black");
		selectedRow.lin.setBackgroundImage("/images/linhaBlack.png");
    }
    selectedRow = null;
    $.btnOk.setEnabled(false);
    $.btnOk.setOpacity(0.6);
}

/**
 * @method buscar
 * Filtra os registros da lista de acordo com o texto informado peo usuário.
 * @param {Object} e
 * @param {String} e.value Valor atual do text input de busca.
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function buscar(e){
	try{
		//Testo se existe alguma busca, caso não exista, deve mostrar a lista padrão, caso haja alguma.
		if(e.value.length == 0 && defaultData){
			defaultRegisters();
			return;
		}
		//Crio uma nova colection que possuí um método para filtrar os registros.
		var Itens = Backbone.Collection.extend({
		    bySearch: function (valor) {
		        filtered = this.filter(function (md) {
		            return md.get(dataColumn).toString().toUpperCase().indexOf(valor.toString().toUpperCase()) > -1;
		        });
		        return new Itens(filtered);
		    }    
		});
		//Instancio a a coleção com os dados da coleção vinculada.
		var temp = new Itens(refColecao.toJSON());
		//Filtro os registros.
		var filteredItens = temp.bySearch(e.value);
		//Verifico se existe alguma extenção do filtro.
		if(filterExtend){
			filteredItens = new Itens(filterExtend({colecaoFiltrada: filteredItens, filtro: e.value, correntList: $.listaPopUp.getData()}));
		}
		//Preencho a lista com os registros filtrados.
		preencher(filteredItens);
		//Libero a memória.
		temp = null;
		filteredItens = null;
	}catch(e){
		Alloy.Globals.onError(e.message, "buscar", "app/widgets/GUI/controllers/PopUpList.js");
	}
}

/**
 * @method defaultRegisters
 * Monta a lista de registros padrão.
 * @alteracao 09/07/2015 191658 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function defaultRegisters(){
	//Crio uma nova colection que possuí um método para filtrar os registros.
	var Itens = Backbone.Collection.extend({
	    byDefault: function () {
	        filtered = this.filter(function (md) {
	        	//Pego todos os registros da coleção padrão
	        	for(var i = 0; i < defaultData.length; i++){
	        		//Verifico se alguma chave bate.
	        		for(var j = 0; j < chaveColumn.length; j++){
	        			//Cada indice da chave deve conseguir identificar o registro unicamente, então se alguma chave bate, este registro pode ser retornado.
						if(md.get(chaveColumn[j]) == defaultData[i][j]){
		        			return true;
		        		}
					}	
	        	}
	            return false;
	        });
	        return new Itens(filtered);
	    }    
	});
	//Instancio a a coleção com os dados da coleção vinculada.
	var temp = new Itens(refColecao.toJSON());
	//Filtro os registros.
	var filteredItens = temp.byDefault();
	//Preencho a lista.
	preencher(filteredItens);
	//Libero a memória.
	temp = null;
	filteredItens = null;
}

/**
 * @method setDefaultData
 * Altera a lista de registros padrão.
 * @param {Object} data Nova lista de registros padrão. Deve ser informado apenas as chaves dos registros.
 */
$.setDefaultData = function(data){
	defaultData = data;
	$.refresh();
};

function empty(e){ e.cancelBubble = true; }
