/**
 * @class widgets.Util.Tela 
 * Configura componentes genéricos na tela.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

/**
 * @method selecionaRowList
 * Seleciona o item.
 * @param {Ti.UI.TableViewRow} row Item da lista.
 * @alteracao 05/05/2015 186931 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function selecionaRowList(row){
	row.children[0].setBackgroundColor("#B6B6B6");
	row._selecionado = true;
}

/**
 * @method deselecionarRowList
 * Deseleciona o item.
 * @param {Ti.UI.TableViewRow} row Item da lista.
 * @alteracao 05/05/2015 186931 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function deselecionarRowList(row){
	row.children[0].setBackgroundColor("white");
	row._selecionado = false;
}

/**
 * @event callbackLongPress
 * Callback da multi-seleção. Seleciona ou deseleciona o item.
 * @alteracao 05/05/2015 186931 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function callbackLongPress(e){
	if(e.row.tipo === 'atualizar'){
		return ;
	}
	if(Ti.Platform.name!=='android' && e.type == 'longpress'){
		e.row._longOcurred = true;
	}
	if(Ti.Platform.name!=='android' && e.type == 'click' && e.row._longOcurred == true){
		e.row._longOcurred = false;
		return ;
	}
	if(e.row._selecionado){
		deselecionarRowList(e.row);
	}
	else{
		if(!this.temSelecinado()){
			Ti.API.info("Um selecionado");
			if(this._clickCallback != undefined){
				Ti.API.info("Removeu o click");
				this.removeEventListener("click", this._clickCallback);
			}
			this.addEventListener("click", callbackLongPress);
			//Aviso que a multi-seleção foi ativada.
			this.fireEvent("enabledMultiselection");
		}
		selecionaRowList(e.row);
	}
	desativarMultiselection(this);
}

/**
 * @method desativarMultiselection
 * Desativa as funcionalidades da multi-seleção.
 * @param {Ti.UI.TableView} lista Lista com a função de multi-seleção.
 * @alteracao 05/05/2015 186931 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function desativarMultiselection(lista){
	if(!lista.temSelecinado()){
		Ti.API.info("nenhum selecionado");
		lista.removeEventListener("click", callbackLongPress);
		if(lista._clickCallback != undefined){
			Ti.API.info("Adicionou o click");
			lista.addEventListener("click", lista._clickCallback);
		}
		//Aviso que a multi-seleção foi desativada.
		lista.fireEvent("disableMultiselection");
	}
}

/**
 * @method initConfigList
 * Permite selecionar mais de um item da lista.
 * @param {Ti.UI.TableView} lista Lista que se deseja adicionar as configurações.
 * @param {Object} parans Parâmetros de configuração.
 * @param {Boolean} multiSelecao Configura a lista para permitir multi-seleção.
 * @param {Function} click Callback do evento de click da lista. Sempre que o parâmetro multiSeleção for true, este parâmetro é orbigatório.
 * @alteracao 05/05/2015 186931 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.initConfigList = function(lista, parans){
	if(parans.click !== undefined){
		lista.addEventListener("click", parans.click.callback);
		lista._clickCallback = parans.click.callback;
	}
	if(parans.multiSelecao !== undefined){
		//Verifica se existe algum item selecionado.
		lista.temSelecinado = function(){
			if(lista.data.length == 0){
				return false;
			}
			for(var i = 0; i < lista.data[0].rows.length; i++){
				if(lista.data[0].rows[i]._selecionado){
					return true;
					break;
				}
			}
			return false;
		};
		//Busca os itens selecionados.
		lista.getSelecionados = function(){
			var selecionados = [];
			if(lista.data.length == 0){
				return selecionados;
			}
			for(var i = 0; i < lista.data[0].rows.length; i++){
				if(lista.data[0].rows[i]._selecionado){
					selecionados.push(lista.data[0].rows[i]);
				}
			}
			return selecionados;
		};
		//Deseleciona os itens da lista.
		lista.releaseSelecionados = function(){
			var desativar = false;
			if(lista.data.length == 0){
				lista.fireEvent("disableMultiselection");
				return ;
			}
			for(var i = 0; i < lista.data[0].rows.length; i++){
				if(lista.data[0].rows[i]._selecionado){
					deselecionarRowList(lista.data[0].rows[i]);
					desativar = true;
				}
			}
			if(desativar){
				desativarMultiselection(lista);	
			}
			else{
				lista.fireEvent("disableMultiselection");
			}
		};
		lista.addEventListener("longpress", callbackLongPress);
		//Cria o efeito de vibrar no long click.
		lista.addEventListener("longclick", function(){});
	}
};


/**
 * Faz as configurações iniciais da window. Deve ser invocado no costrutor de todo Controller que possui janela.
 * @param {Ti.UI.Window} janela Window a se configurar.
 * @param {Alloy} runningAlloy Alloy vinculado ao Controller.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.initConfigWindow = function(janela, runningAlloy)
{
	try{
		
		janela.addEventListener("close", function(e){
			runningAlloy.destroy();
		});
		
		if(Ti.Platform.name === 'android')
		{
			janela.width = Ti.UI.FILL;
			janela.height = Ti.UI.FILL;
			janela.windowSoftInputMode = Titanium.UI.Android.SOFT_INPUT_ADJUST_PAN;
			janela.exitOnClose = false;
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "initConfigWindow", "app/widgets/Util/controllers/Tela.js");
	}
};

/**
 * Faz as configurações iniciais da popup na tela. Deve ser invocado no costrutor de todo Controller que se comporta como popup.
 * @param {Ti.UI.View} popupController PopUp a se configurar.
 * @param {Function} showFunction Rotina executa toda vez que o método show da popup é invocado.
 * @param {Function} cancelFunction Rotina executa toda vez que o método close da popup é invocado.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.initConfigPopUp = function(popupController, showFunction){
	var camada = Alloy.createWidget("GUI", "Camada").getView();
	var component = popupController.getView();
	var animacaoAbrir = Ti.UI.createAnimation({
		duration: 200,
		opacity: 1
	});
	
	popupController.show = function(parans){
		try{
			//Adiciono a nova função do botão voltar no android. Não interfere com o iOS.
			Alloy.Globals.currentWindow().stackBackFunction.push(popupController.close);
			Alloy.Globals.currentWindow().add(camada);
			component.opacity = 0;
			Alloy.Globals.currentWindow().add(component);
			component.animate(animacaoAbrir);
			if(showFunction){
				showFunction(parans);	
			}
		}
		catch(e){
			Alloy.Globals.onError(e.message, "initConfigPopUp", "app/widgets/Util/controllers/Tela.js");
		}
	};
	popupController.close = function(parans){
		try{
			//Desempilho a função do botão voltar para essa popup.
			Alloy.Globals.currentWindow().stackBackFunction.pop();
			Alloy.Globals.currentWindow().remove(camada);
			Alloy.Globals.currentWindow().remove(component);
		}
		catch(e){
			Alloy.Globals.onError(e.message, "initConfigPopUp", "app/widgets/Util/controllers/Tela.js");
		}
	};
};
