/**
 * @class widgets.GUI.ListaServicos
 * Lista lateral contendo os serviços.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

/**
 * @property {widgets.GUI.Camada} viewCamada camada adicionada a janela quando a lista é apresentada.
 * @private  
 */
var viewCamada = $.camada.getView();
viewCamada.setOpacity(0);

/**
 * @property {Array} dadosServicos Array de servicos presentes na lista.
 * @private 
 */
var dadosServicos = [];

$.boxListaServicos.setLeft(-Alloy.Globals.Servicos.Largura);
/**
 * @method abrir
 * Abre a lista de serviços.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.abrir = function(){
	Alloy.Globals.currentWindow().stackBackFunction.push($.fechar);
	Alloy.Globals.currentWindow().add($.mestre);
	var animationCamada = Titanium.UI.createAnimation({
		opacity: 1,
		duration: 200
	});
	viewCamada.animate(animationCamada);
	var animation = Titanium.UI.createAnimation({
		left: 0,
		duration: 200
	});
	$.boxListaServicos.animate(animation);
};

/**
 * @method fechar
 * Fecha a lista de serviços.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.fechar = function(){
	//Retiro a função do botao voltar no android
	Alloy.Globals.currentWindow().stackBackFunction.pop();
	var pai = Alloy.Globals.currentWindow();
	var animationCamada = Titanium.UI.createAnimation({
		opacity: 0,
		duration: 200
	});
	viewCamada.animate(animationCamada);
	var animation = Titanium.UI.createAnimation({
		left: -Alloy.Globals.Servicos.Largura,
		duration: 200
	});
	animation.addEventListener("complete", function(e){
		pai.remove($.mestre);
	});
	$.boxListaServicos.animate(animation);
};

/**
 * @event click
 * Fecha a lista ao se clicar na camada
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
viewCamada.addEventListener("click", function(e){
	$.fechar();
});

/**
 * @method resetar
 * Deleta todos os serviços da lista.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.resetar = function(){
	try{
		dadosServicos = [];
		$.atualizar();
	}
	catch(e){
		Alloy.Globals.onError(e.message, "resetar", "app/widgets/GUI/controllers/ListaServicos.js");
	}	
};

/**
 * @method atualizar
 * Gera novamente a lista de serviços de acordo com o vetor {dadosServicos}
 * @alteracao 24/02/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
$.atualizar = function(){
	$.servicos.setData(dadosServicos);
};

/**
 * @method criarSessao
 * Cria uma nova sessão de servicos na lista de serviços.
 * @private
 * @param {String} Titulo Titulo do serviço.
 * @param {String} icone Caminho para o ícone do serviço.
 * @returns {Ti.UI.TableViewSection}
 * @alteracao 24/02/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
function criarSessao(Titulo, icone){
	try{
		//Crio a sessao.
		var vwSessao = Ti.UI.createView({
			backgroundColor: "white",
			width: Ti.UI.FILL,
			height: Alloy.Globals.CustomComponentHeight
		});
		
		var lblSessao = Ti.UI.createLabel({
			color: "black",
			text: Titulo,
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			font: {fontSize: Alloy.Globals.CustomTextSize},
			width: Ti.UI.FILL,
			left: 24
		});
		
		vwSessao.add(lblSessao);
		
		var iconServico = Ti.UI.createLabel({
			backgroundImage: icone,
			left: 10,
			width: 18,
			height: 18,
		});
		
		vwSessao.add(iconServico);
		
		var divisoria = Ti.UI.createView({
			backgroundImage: "/images/linhaBlack.png",
			width: "94%",
			left: "4%",
			bottom: 0,
			height: Alloy.isHandheld?0.5:1,
			opacity: 0.8
		});
		
		vwSessao.add(divisoria);
		
		var sessao = Ti.UI.createTableViewSection({
			headerView: vwSessao
		});
		
		var click = Ti.UI.createView({
			width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			backgroundColor: "transparent",
			container: sessao
		});
		
		vwSessao.add(click);
		
		return sessao;
	}
	catch(e){
		Alloy.Globals.onError(e.message, "criarSessao", "app/widgets/GUI/controllers/ListaServicos.js");
	}
}

/**
 * @event clickRowSection
 * Disparado quando se clica em uma row que pertence a uma seção.
 * @alteracao 24/02/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
function clickRowSection(e){
	e.row.funcao(e.row.servico);	
}

/**
 * @method criarRowSessao
 * Cria um serviço dentro de uma sessão de serviços.
 * @private
 * @param {Object} parans Parâmetros da função.
 * @param {String} parans.servico Título do serviço.
 * @param {Function} parans.callback Função que será executada ao se clicar no serviço.
 * @returns {Ti.UI.TableViewRow}
 * @alteracao 24/02/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
function criarRowSessao(parans){
	try{
		var row = Ti.UI.createTableViewRow({
			width: Ti.UI.FILL,
			height: Alloy.Globals.CustomComponentHeight,
			backgroundColor: "#e9e7e7",
			servico: parans.servico,
			funcao: parans.callback
		});
		
		var vwRow = criarRowView({servico: parans.servico, TableRow: row});
		
		row.add(vwRow);
		
		return row;
	}
	catch(e){
		Alloy.Globals.onError(e.message, "criarRowSessao", "app/widgets/GUI/controllers/ListaServicos.js");
	}
	
}

/**
 * @method criarRowView
 * Cria uma nova view de serviço.
 * @private
 * @param {Object} parans Parâmetros da função.
 * @param {String} parans.servico Título do serviço.
 * @param {String} parans.icon Caminho para o ícone do serviço. Pode ser omitido.
 * @param {Ti.UI.View} parans.TableRow Container em que a view será inserida.
 * @returns {Ti.UI.Label}
 * @alteracao 24/02/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
function criarRowView(parans){
	try{
		
		if(parans.icon){
			var iconServico = Ti.UI.createLabel({
				backgroundImage: parans.icon,
				left: 10,
				width: 18,
				height: 18,
			});
			
			parans.TableRow.add(iconServico);	
		}
		
		var divisoria = Ti.UI.createView({
			backgroundImage: "/images/linhaBlack.png",
			width: "94%",
			left: "4%",
			bottom: 0,
			height: Alloy.isHandheld?0.5:1,
			opacity: 0.8
		});
		
		parans.TableRow.add(divisoria);
		
		var novoServico = Ti.UI.createLabel({
			text: parans.servico,
			width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			left: parans.icon?24:undefined,
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			font: {fontSize: Alloy.Globals.CustomTextSize},
			color: "black"
		});
		
		parans.TableRow.add(novoServico);
		
		return novoServico;
	}
	catch(e){
		Alloy.Globals.onError(e.message, "criarRowView", "app/widgets/GUI/controllers/ListaServicos.js");
	}
}

/**
 * @event colapsarSecao
 * Expande ou contrai os serviços da sessão em que ocorreu o click.
 * @param {Ti.UI.TableViewSection} e 
 * @alteracao 24/02/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function colapsarSecao(e){
	var servicosSecao = null;
	if(e.source.container.aberto){
		servicosSecao = e.source.container.servicos;
		for(var i = 0; i < servicosSecao.length; i++){
			e.source.container.remove(servicosSecao[i]);
		}
		e.source.container.aberto = false;
	}
	else{
		servicosSecao = e.source.container.servicos;
		for(var i = 0; i < servicosSecao.length; i++){
			e.source.container.add(servicosSecao[i]);
		}
		e.source.container.aberto = true;
	}
	$.atualizar();
}

/**
 * @method adicionarSecaoServicos
 * Adiciona uma nova sessão de serviços.
 * @param {String} Titulo Título do serviço.
 * @param {String} icone Caminho para o ícone do serviço. Pode ser omitido.
 * @param {Array} filhos Lista de serviços da sessão.
 * @param {String} filhos.servico Título do serviço.
 * @param {Function} filhos.callback Função que será executada ao se clicar no serviço.
 * @returns {null}
 * @alteracao 24/02/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
$.adicionarSecaoServicos = function(Titulo, icone, filhos){
	try{
		//Crio a sessao.
		var tblSection = criarSessao(Titulo, icone);
		var servicos = [];
		tblSection.aberto = false;
		for(var i = 0; i < filhos.length; i++){
			var rowSection = criarRowSessao({servico: filhos[i].servico, callback: filhos[i].callback});
			servicos.push(rowSection);
		}
		tblSection.servicos = servicos;
		tblSection.headerView.addEventListener("click", colapsarSecao);
		dadosServicos.push(tblSection);
		$.atualizar();
	}
	catch(e){
		Alloy.Globals.onError(e.message, "adicionarSecaoServicos", "app/widgets/GUI/controllers/ListaServicos.js");
	}
};

/**
 * @method adicionarServico
 * Adiciona um novo serviço a lista.
 * @param {String} icon Caminho para o icone do serviço.
 * @param {String} servico Descrição do serviço. 
 * @param {Function} callback Rotina executada ao se selecionar o serviço. 
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.adicionarServico = function(icon, servico, callback){
	try{
		var boxNovoServico = Ti.UI.createView({
			width: Ti.UI.FILL,
			height: Alloy.Globals.CustomComponentHeight,
			backgroundColor: "white",
			ativado: false
		});
		
		var vwRow = criarRowView({icon: icon, servico: servico, TableRow: boxNovoServico});
		
		vwRow.addEventListener("click", function(e){
			callback(e.source.text);	
		});
		
		var novaSessao = Ti.UI.createTableViewSection({
			headerView: boxNovoServico
		});
		
		dadosServicos.push(novaSessao);
		$.atualizar();	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "adicionarServico", "app/widgets/GUI/controllers/ListaServicos.js");
	}
};
