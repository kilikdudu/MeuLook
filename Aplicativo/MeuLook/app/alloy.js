/**
 * @class Alloy.Globals
 * Classe global, instanciada automáticamente antes de executar a classe controllers.Index.  
 * Todas as propriedades publicas são acessíveis através de Alloy.Globals, que é uma variável global. 
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação
 */

/**
 * @property {Number} CustomComponentHeight
 * Altura padrão dos controles. Exemplo: Botões
 */
Alloy.Globals.CustomComponentHeight = 40;
/**
 * @property {Object} CustomImageSize Tamanho padrão dos icones
 * @property {Number} CustomImageSize.height Altura
 * @property {Number} CustomImageSize.width Largura
 */
Alloy.Globals.CustomImageSize = {height: 32, width: 32};
/**
 * @property {Number} CustomTextSize Tamanho padrão da fonte dos controles.
 */
Alloy.Globals.CustomTextSize = 18;
/**
 * @property {Number} CustomTitleFont Tamanho padrao da fonte dos titulos dos controles.
 */
Alloy.Globals.CustomTitleFont = 20;
/**
 * @property {String} MainColor Cor padrão no aplicativo. Todo controle que precise ficar em destaque, deve estar nessa cor.
 */
Alloy.Globals.MainColor = "#5aae2c";
/**
 * @property {String} MainColorLight Cor que indica quando um controle foi selecionado. Exemplo: clique no botão.
 */
Alloy.Globals.MainColorLight = "#bbeaa2";

/**
 * @property MainDomain
 * Endereço do domínio da empresa. Instanciado após o login.
 * @type {String}
 */
Alloy.Globals.MainDomain = "http://192.168.25.191:8484/";

//Acesso a nuvem do appcelerator
var Cloud = require('ti.cloud');
Cloud.debug = true;  // optional; if you add this line, set it to false for production
Alloy.Globals.Cloud = Cloud;

//Acesso a nuvem do facebook
Alloy.Globals.Facebook = require('facebook');
Alloy.Globals.Facebook.permissions = ["public_profile", "email"];
//Alloy.Globals.Facebook.addEventListener('logout', finalizarLogout);

Alloy.Globals.CloudPush = require('ti.cloudpush');
Alloy.Globals.deviceToken = null; 
Alloy.Globals.CloudPush.retrieveDeviceToken({
        success: function deviceTokenSuccess(e) {
        	Ti.API.info('Device token obtido com sucesso ! ');
        	Alloy.Globals.deviceToken = e.deviceToken;
        	Ti.App.fireEvent("devitokenObtido");
        },
        error: function deviceTokenError(e) {
            Ti.API.info('Erro ao tentar obter o Device token: ' + e.error);
            Alloy.Globals.deviceToken = null;
     }
});

Ti.App.addEventListener("devitokenObtido", function(e){
	if(Alloy.Globals.deviceToken){
		Ti.API.info('Chamou evento de token');
		Alloy.Globals.Cloud.PushNotifications.subscribe({
		    channel: 'promocoes', // "alert" is channel name
		    device_token: Alloy.Globals.deviceToken,
		    type: 'android'
		}, function (e){
		    if (e.success) {
		       Ti.API.info('Inscrito no canal de notificações promoções.');
		    }else{
		       Ti.API.info('Erro ao se inscrever no canal promoções: ' +((e.error && e.message) || JSON.stringify(e)));
		    }
		});
	}
});

Alloy.Globals.Map = require('ti.map');

Alloy.Globals.Cliente = Alloy.createCollection("Cliente");
Alloy.Globals.Cliente.fetch();

/**
 * @property {Object} InfoUser Dados do usuário no ACS. 
 */
Alloy.Globals.InfoUser = null;

/**
 * @property {Array} pilhaWindow Pilha contendo todas as janelas abertas. O topo da pilha representa a janela atual.
 */
Alloy.Globals.pilhaWindow = [];
/**
 * @method currentWindow
 * Retorna a janela atual.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 * @returns {Ti.UI.Window}
 */
Alloy.Globals.currentWindow = function(){
	return Alloy.Globals.pilhaWindow[Alloy.Globals.pilhaWindow.length - 1];
};

/**
 * @property {widgets.Util.Tela} configTela propriedade usada configurar telas.
 * @private
 */
var configTela = Alloy.createWidget("Util", "Tela");
/**
 * @method configWindow
 * Configura a janela para o padrão da arquitetura. Obrigatório o uso no construtor de qualquer janela.
 * @param {Ti.UI.Window} janela Janela que se deseja configurar.
 * @param {Alloy} seuAlloy Variável $ reservada em todo controller.
 * @returns {null}
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
Alloy.Globals.configWindow = function(janela, seuAlloy){
	configTela.initConfigWindow(janela, seuAlloy);
};

/**
 * @method configPopUp
 * Configura a popup para o padrão da arquitetura. Obrigatório o uso no construtor de qualquer popup.
 * @param {Controller} controller Controller da popup.
 * @param {Function} [showFunction] Função que será executada toda vez que o controller executar a função show.
 * @param {Function} [cancelFunction] Função que será executada toda vez que o controller executar a função close.
 * @returns {null} 
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
Alloy.Globals.configPopUp = function(controller, showFunction, cancelFunction){
	configTela.initConfigPopUp(controller, showFunction, cancelFunction);
};
/**
 * @property {Boolean} estaOnline Indica se o dispositivo está online.
 */
Alloy.Globals.estaOnline = Ti.Network.online;
/**
 * @property {widgets.Util.Format} format Objeto utilizado para formatação de dados. Toda formatação de dados deve ser feita por esse objeto.
 */
Alloy.Globals.format = Alloy.createWidget("Util", "Format");
/**
 * @property {widgets.DAL.widget} DAL Objeto utilizado para a camada de persistencia de dados.
 */
Alloy.Globals.DAL = Alloy.createWidget("DAL");
/**
 * @property {widgets.Util.Transicao} Transicao Deve ser utilizado sempre que for necessário chamar uma nova janela.
 */
Alloy.Globals.Transicao = Alloy.createWidget("Util", "Transicao");

/**
 * @property {widgets.Util.Validador} format Objeto utilizado para validação de dados.
 */
Alloy.Globals.validador = Alloy.createWidget("Util", "Validador");

/**
 * @method Alerta
 * Exibe um alerta simples com o título e a mensagem.
 * @param {String} titulo Título do alerta. Por parão será considerado "Alerta".
 * @param {String} mensagem Mensagem a ser exibida no alerta.
 * @returns {null}
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
Alloy.Globals.Alerta = function(titulo, mensagem){
	var check = Alloy.createWidget("GUI", "Mensagem");
	check.init(titulo, mensagem);
	check.show();
};

var progressIndicator = Ti.UI.Android.createProgressIndicator({
	  message: 'Carregando...',
	  location: Ti.UI.Android.PROGRESS_INDICATOR_DIALOG,
	  type: Ti.UI.Android.PROGRESS_INDICATOR_INDETERMINANT,
	  cancelable: false
	});

var contChamadasCarregando = 0;

Alloy.Globals.carregando = function(){
	contChamadasCarregando++;
	progressIndicator.show();
};

Alloy.Globals.carregou = function(){
	contChamadasCarregando--;
	if(contChamadasCarregando <= 0){
		contChamadasCarregando = 0;
		progressIndicator.hide();	
	}
};

/**
 * @property {widgets.Util.Format} format Objeto utilizado para formatação de dados. Toda formatação de dados deve ser feita por esse objeto.
 */
Alloy.Globals.GPS = Alloy.createWidget("Util", "GPS");

/**
 * @property {widgets.Util.Erro} telaErro Controller da tela de erro.
 * @private
 */
var telaErro = Alloy.createWidget("Util", "Erro");
/**
 * @event onError
 * Deve ser invocado em todo caso catch não tratado.
 * @returns {null}
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
Alloy.Globals.onError = function(erro, rotina, arquivo){
	telaErro.show(erro, rotina, arquivo);
};

/**
 * @method logout
 * Exibe a mensagem de confirmação de logout.
 * @private
 * @returns {null}
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
Alloy.Globals.logout = function(){
	var check = Alloy.createWidget("GUI", "Mensagem");
	check.init("Atenção !", "Gostaria de sair ?", true);
	check.show({callback: executeLogout});	
};
/**
 * @event executeLogout
 * Volta a tela de login.
 * @param {Object} parans Resposta da mensagem de logout.
 * @param {Boolean} parans.value true para o click no ok, false para o click no cancelar
 * @returns {null}
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function executeLogout(parans){
	if(parans.value){
		Alloy.Globals.carregando();
		Alloy.Globals.Cloud.Users.logout(function (e) {
		    if (e.success) {
		    	if(Alloy.Globals.InfoUser.external_accounts.length > 0){
		    		Alloy.Globals.Facebook.logout();
		    	}
		    	finalizarLogout({});
		    	
		    } else {
		        alert('Error:\n' +
		            ((e.error && e.message) || JSON.stringify(e)));
		    }
		});
	}
}

function finalizarLogout(e){
	Alloy.Globals.Facebook.removeEventListener('logout', finalizarLogout);
	Alloy.Globals.Cliente.at(0).destroy({silent: true});
	Alloy.Globals.Cliente.fetch();
	Alloy.Globals.InfoUser = null;
	Alloy.Globals.carregou();
    Alloy.createController("index");
	Ti.API.info("logout, tamanhao da pilha: " + Alloy.Globals.pilhaWindow.length);
}

/**
 * @method resetPilhaWindow
 * Fecha todas as janelas abertas da aplicação, menos a janela atual.
 * @returns {null}
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
Alloy.Globals.resetPilhaWindow = function(){
	while(Alloy.Globals.pilhaWindow.length > 1){
		Alloy.Globals.pilhaWindow[0].close();
		Alloy.Globals.pilhaWindow[0] = null;
		Alloy.Globals.pilhaWindow.splice(0, 1);	
	}
	Ti.API.info("janelas removidas, tamanhao da pilha: " + Alloy.Globals.pilhaWindow.length);
	return null;
};
/**
 * @property {Object} Servicos Tamanho da barra lateral de serviços.
 * @property {Number} Servicos.Largura Largura.
 */
Alloy.Globals.Servicos = {Largura: 250};
/**
 * @property {widgets.GUI.ListaServicos} ListaServicos Controller da barra lateral de serviços.
 */
Alloy.Globals.ListaServicos = Alloy.createWidget("GUI", "ListaServicos");
/**
 * @event callbackServicos
 * Quando um novo serviço é selecionado pela barra lateral de serviços, essa rotina é invocada.
 * Como usar: Caso o serviço de nome 'novo' seja criado, deve-se criar um case dentro dessa rotina com o mesmo nome. 
 * Dentro do case deve-se colocar o código de instancia desse novo serviço. 
 * @param {String} nome Nome do serviço.
 * @returns {null}
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var callbackServicos = function(nome){
	try{
		Alloy.Globals.ListaServicos.fechar();
		switch(nome) {
			case "Sair": 
				Alloy.Globals.logout();
				break;
			case "Alterar dados": 
				var novo = Alloy.createController("Perfil/Cadastro", {tipo: "atualizar"});
				Alloy.Globals.Transicao.proximo(novo, novo.init, {});
				break;
			default :
				alert("Servico não implementado.");
				break;	
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "callbackServicos", "app/alloy.js");
	}
};

/**
 * @method iniciarServicos
 * Inicia a lista de serviços com os serviços globais.
 * Qualquer novo serviço no aplicativo deve ser adicionado por essa rotina. 
 * Exemplo: Queremos adicionar o serviço 'novo', basta vir nesta rotina e invocar a rotina adicionarServico da classe widgets.GUI.ListaServicos passando os devidos parâmetros.
 * @returns {null}
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
Alloy.Globals.iniciarServicos = function(){
	Alloy.Globals.ListaServicos.resetar();
	Alloy.Globals.ListaServicos.adicionarServico("/images/perfil.png", "Alterar dados", callbackServicos);
	Alloy.Globals.ListaServicos.adicionarServico("/images/logout.png", "Sair", callbackServicos);
};

/**
 * @event Network_change
 * Disparado ao se clicar no ícone de lista. Caso exista uma janela anterior, esta janela será fechada e a anterior será aberta.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
Ti.Network.addEventListener("change", function(e){
	Alloy.Globals.estaOnline = e.online;
});

