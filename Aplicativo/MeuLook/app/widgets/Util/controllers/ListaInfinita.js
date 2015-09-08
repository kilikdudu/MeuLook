/**
 * @class widgets.Util.ListaInfinita
 * Encapsula as configurações e funções necessárias para a lista infinita.
 * @alteracao 05/05/2015 186931 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

if(args.colecao == undefined){
	console.error('É necessário passar uma BackBone.Collection como parâmetro ({colecao}).');
}

if(args.lista == undefined){
	console.error('É necessário passar uma Ti.tableVIew como parâmetro ({lista}).');
}

if(args.refreshCallback == undefined){
	console.error('É necessário passar uma Function de callback para a funcionalidade de atualizar a lista como parâmetro ({refreshCallback}).');
}

/**
 * @property {Function} refreshCallback Função que busca dados da lista.
 * @private
 */
var refreshCallback = args.refreshCallback;

/**
 * @property {Ti.UI.TableView} lista Lista que vincula os seus dados. 
 */
var lista = args.lista;

/**
 * @property {BackBone.Collection} colecao Coleção contendo os dados da lista. 
 */
var colecao = args.colecao;

/**
 * @property {Number} limite Número de registros por página. 
 */
var limite = args.limite || 15;

/**
 * @property {Ti.UI.TableViewRow} tbwRow Container das funcionalidades da lista infinita. 
 */
var tbwRow = Ti.UI.createTableViewRow({
	width: Titanium.UI.FILL,
	height: 60,
	tipo: "atualizar"
});

/**
 * @property {Ti.UI.Button} btnMostrarMais Botão vinculado a função de buscar mais registros. 
 */
var btnMostrarMais = Ti.UI.createButton({
	width: "80%",
	height: 40,
	borderRadius: 12,
	color: 'white',
	font: {fontSize: 18},
	backgroundColor: Alloy.Globals.MainColor,
	title: "Mostrar mais",
	opacity: 1
});

/**
 * @property {Ti.UI.ImageView} imgCarregando Loader indicando que o sistema está buscando novos registros. 
 */
var imgCarregando = Ti.UI.createImageView({
	width: 32,
	height: 32,
	images: Alloy.createWidget("Util", "Animation").getImagesLoader(),
	duration: 100,
	opacity: 0
});
//Adiciono os itens no container
tbwRow.add(imgCarregando);
tbwRow.add(btnMostrarMais);

/**
 * @property {Boolean} temMultiSelecao Indica se a lista possuí multi-seleção. 
 */
var temMultiSelecao = args.multiselecao || false;

/**
 * @method myRefresher
 * Atualiza a lista com a mesma quantidade de registros que ela possuí atualmente. 
 * Caso a mesma possua menos registros que a variável widgets.Util.ListaInfinita.limite a quantidade de registros será a indicada na variável. 
 * @alteracao 05/05/2015 186931 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.myRefresher = function() {
	try{
		//Se a lista está configurada para multi-seleção, a rotina deseleciona os registros antes de buscar mais registros.
		if(temMultiSelecao){
			lista.releaseSelecionados();	
		}
		var qtde = colecao.length;
		if(qtde < limite){
			qtde = limite;
		}
		refreshCallback({semLoader: true, limite: qtde, cursor: 0});	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "myRefresher", "widgets/Util/controllers/ListaInfinita.js");
	}	
};

/**
 * @method mostrarMais
 * Busca mais widgets.Util.ListaInfinita.limite registros para a lista.
 * @alteracao 05/05/2015 186931 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.mostrarMais = function(){
	try{
		//Se a lista está configurada para multi-seleção, a rotina deseleciona os registros antes de buscar mais registros.
		if(temMultiSelecao){
			lista.releaseSelecionados();	
		}
		//Atualizo o cursor com o valor mais alto na coluna Row.  
		//var valorMaximo = _.max(colecao.toJSON(), function(processo){ return processo.Row; });
		refreshCallback({semLoader: true, limite: limite, cursor: colecao.length});	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "mostrarMais", "widgets/Util/controllers/ListaInfinita.js");
	}
};

/**
 * @method verificaFimLista
 * Verifica se a quantidade passada é menor que a quantidade de registros por página, 
 * se sim remove o container que funcionalidades da lista infinita.
 * @param {Number} qtde Quantidade de registros retornados pela consulta ao webservice.
 * @alteracao 05/05/2015 186931 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.verificaFimLista = function(qtde){
	try{
		if(qtde < limite){
			lista.deleteRow(tbwRow);
		}	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "verificaFimLista", "widgets/Util/controllers/ListaInfinita.js");
	}
};

/**
 * @method adicionarRegistros
 * Adiciona mais registros a lista.
 * @param {Json} ret Registros retornados pela consulta ao webservice.
 * @alteracao 05/05/2015 186931 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.adicionarRegistros = function(ret){
	try{
		colecao.add(ret, {silent: true});
		colecao.trigger("change");
		//Verifico se a quantidade é menor que o limite, se sim as funcionalidade da lista infinita ficam invisíveis.
		if(ret.length < limite){
			imgCarregando.setOpacity(0);
			btnMostrarMais.setOpacity(0);
			return ;
		}
		//Se não eu adiciono as funcionalidades novamente.
		lista.appendRow(tbwRow);
		imgCarregando.setOpacity(0);
		btnMostrarMais.setOpacity(1);	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "adicionarRegistros", "widgets/Util/controllers/ListaInfinita.js");
	}
};

/**
 * @method iniciarLoader
 * Mostra a animação de loader no rodapé da lista.
 * @alteracao 05/05/2015 186931 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.iniciarLoader = function(){
	try{
		imgCarregando.start();
		imgCarregando.setOpacity(1);
		btnMostrarMais.setOpacity(0);	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "iniciarLoader", "widgets/Util/controllers/ListaInfinita.js");
	}
};

/**
 * @method reiniciarContainer
 * Reinicia o container.
 * @alteracao 05/05/2015 186931 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.reiniciarContainer = function(parans){
	try{
		$.adicionarTBR();
		var flag = true;
		if(parans){
			flag = parans.checaFim || true;
		}
		if(flag){
			$.verificaFimLista(colecao.length);	
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "fecharLoader", "widgets/Util/controllers/ListaInfinita.js");
	}
};

/**
 * @method adicionarTBR 
 * Adiciona o container a lista.
 * @alteracao 05/05/2015 186931 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.adicionarTBR = function(){
	try{
		imgCarregando.setOpacity(0);
		btnMostrarMais.setOpacity(1);
		lista.appendRow(tbwRow);	
	}
	catch(e){
		Alloy.Globals.onError(e.message, "adicionarTBR", "widgets/Util/controllers/ListaInfinita.js");
	}
};