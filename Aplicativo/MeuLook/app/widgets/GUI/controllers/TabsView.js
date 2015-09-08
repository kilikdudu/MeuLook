/**
 * @class widgets.GUI.TabsView
 * Switcher personalizado.
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
var args = arguments[0] || {};

/**
 * @property {Array} pages Páginas contidas no paging control. 
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var pages = [];
/**
 * @property {Number} indiceAtual Indice da página atual. 
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var indiceAtual = null;
/**
 * @property {Number} numberOfPage Quantidade de páginas na scrollable view. 
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var numberOfPages = null;

/**
 * @method init
 * Construtor da classe 
 * @param {Array} views Views que deverão ficar contidas na scrollable view.
 * @param {Array} titulos Vetor de títulos das abas.
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.init = function(views, titulos, parans){
	$.boxTabsView.setViews(views);
	preenchePaggingControl(titulos);
};

$.setViewIndex = function(index){
	if(indiceAtual == index){return;}
	$.boxTabsView.scrollToView(index);
};

$.removePageControl = function(){
	$.boxTabsView.scrollingEnabled = false;
	$.boxTabsView.top = 0;
	$.pagingControl.height = 0;
};

$.adicionaPageControl = function(){
	$.boxTabsView.scrollingEnabled = true;
	$.boxTabsView.top = 40;
	$.pagingControl.height = 40;
};

/**
 * @method preenchePaggingControl
 * Monta o pagging controll.
 * @private
 * @param {Object} titulos Vetor de títulos das abas.
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * @alteracao 10/04/2015 185753 Projeto Carlos Eduardo Santos Alves Domingos
 * Alterado a cor de fundo das tabs.
 */
function preenchePaggingControl(titulos){
	numberOfPages = titulos.length;
	//Obtenho a largura da label.
	var largura = 100/numberOfPages;
	for (var i = 0; i < numberOfPages; i++) {
		var lblPage = Ti.UI.createLabel({
			text: titulos[i]
		});
		var sty = $.createStyle({
			classes: ["descricaoTitulo"],
			apiName: 'Label',
			color: "black",
			width: "100%",
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			wordWrap: false,
			ellipsize: true,
			opacity: 0.5
		});
		lblPage.applyProperties(sty);
		var faixa = Ti.UI.createView({
			backgroundColor: Alloy.Globals.MainColorLight,
			height: 5,
			width: "100%",
			bottom: 0,
			opacity: 0
		});
		var vwClick = Ti.UI.createView({
			width: "100%",
			height: "100%",
			backgroundColor: "transparent",
			indice: i
		});
		var page = Ti.UI.createView({
			width: largura + "%",
			height: 40,
			lbl: lblPage,
			fx : faixa, 
			backgroundColor: "#E6E6E6"
		});
		page.add(lblPage);
		if(i != numberOfPages - 1){
			var divisoria = Ti.UI.createView({
				backgroundColor: "black",
				height: 25,
				right: 0,
				width: Alloy.isHandheld?0.5:1
			});
			page.add(divisoria);
		}
		page.add(faixa);
		page.add(vwClick);
		vwClick.addEventListener("click", function(e){
			$.boxTabsView.currentPage = e.source.indice;
		});
		// Store a reference to this view
		pages.push(page);
		// Add it to the container
		$.pagingControl.add(page);
	}
	
	ativaAba(pages[$.boxTabsView.getCurrentPage()]);
	indiceAtual = $.boxTabsView.getCurrentPage();
	$.boxTabsView.views[indiceAtual]._ativada = true;
	$.trigger("changeView", {id: indiceAtual});
	$.boxTabsView.addEventListener("scroll", onScroll);
	$.boxTabsView.addEventListener("postlayout", onPostLayout);
}

/**
 * @method desativaAba
 * Desativa a página do pagging controll.
 * @private
 * @param {Object} page Página do pagging controll.
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function desativaAba(page){
	page.fx.setOpacity(0);
	page.lbl.setOpacity(0.5);
}

/**
 * @method ativaAba
 * Ativa a página do pagging controll.
 * @private
 * @param {Object} page Página do pagging controll.
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function ativaAba(page){
	page.fx.setOpacity(1);
	page.lbl.setOpacity(1);
}

/**
 * @event onScroll
 * Quando a página atual é alterada.
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function onScroll(event){
	//Testo se o evento tem como pai a scrollable view ou uma ScrollView. Caso seja uma ScrollView eu invoco o método {onPostLayout}.
	if(event.currentPage){
		if(indiceAtual == event.currentPage){return;}
		for (var i = 0; i < numberOfPages; i++) {
			$.boxTabsView.views[i]._ativada = false;
			desativaAba(pages[i]);
		}
		ativaAba(pages[event.currentPage]);
		indiceAtual = event.currentPage;
		$.boxTabsView.views[indiceAtual]._ativada = true;
		$.trigger("changeView", {id: indiceAtual});
	}
	else{
		onPostLayout(null);
	}
};

/**
 * @event onPostLayout
 * Quando a página atual avisa que está pronta.
 * @alteracao 05/03/2015 180419 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function onPostLayout(event) {
	if(indiceAtual == $.boxTabsView.getCurrentPage()){return;}
 	for (var i = 0; i < numberOfPages; i++) {
 		$.boxTabsView.views[i]._ativada = false;
 		desativaAba(pages[i]);
	}
	ativaAba(pages[$.boxTabsView.getCurrentPage()]);
	indiceAtual = $.boxTabsView.getCurrentPage();
	$.boxTabsView.views[indiceAtual]._ativada = true;
	$.trigger("changeView", {id: indiceAtual});
};