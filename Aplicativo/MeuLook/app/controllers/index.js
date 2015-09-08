/**
 * @class controllers.Index
 * Classe principal, primeira a ser executada.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

var semaforoLogin = false;

var CloudService = Alloy.createWidget("CloudService", "Login");

function updateLoginStatus() {
	if(semaforoLogin){return;}
	semaforoLogin = true;
	 if (Alloy.Globals.Facebook.loggedIn) {
	 		Alloy.Globals.carregando();
	        Alloy.Globals.Cloud.SocialIntegrations.externalAccountLogin({
	            type: 'facebook',
	            token: Alloy.Globals.Facebook.accessToken
	        }, 
	        function (e) {
				 if (e.success) {
				 	var user = e.users[0];
	                CloudService.gravaUsuario(user);
	                callbackOK();
	            }
				else {
					Alloy.Globals.Alerta("Falha", "Não foi exetuado o login pelo facebook.");
	            } 
	            Alloy.Globals.carregou();
			});
	    }
	 else {
	 	Alloy.Globals.Alerta("Falha", "Não foi exetuado o login pelo facebook.");
	 }
}
// when the user logs into or out of Facebook, link their login state with ACS
Alloy.Globals.Facebook.addEventListener('login', updateLoginStatus);

function loginFacebook(e){
	Alloy.Globals.Facebook.authorize();
}


/**
 * @method callbackOK
 * Rotina executada caso o login seja bem-sucedido.
 * Chama a classe Boletos e inicia a lista de serviços com os serviços globais.
 * @private
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var callbackOK = function(){
	try{
		Alloy.Globals.Facebook.removeEventListener('login', updateLoginStatus);
		Alloy.Globals.iniciarServicos();
		Alloy.Globals.carregou();
		var novo = Alloy.createController("Principal");
		Alloy.Globals.Transicao.nova(novo, novo.init, {});
	}
	catch(e){
		Alloy.Globals.onError(e.message, "callbackOK", "app/controllers/index.js");
	}
};

/**
 * @method callbackNaoOK
 * Rotina executada caso ocorra erro ao tentar fazer o login.
 * @private
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var callbackNaoOK = function(e){
	try{
		Alloy.Globals.Alerta("Erro ao entrar", e.message);
		Alloy.Globals.carregou();
	}
	catch(e){
		Alloy.Globals.onError(e.message, "callbackNaoOK", "app/controllers/index.js");
	}
};

/**
 * @method init
 * Construtor da classe
 * @private
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function init(){
	try{
		$.janela.fbProxy = Alloy.Globals.Facebook.createActivityWorker({lifecycleContainer: $.janela});
		Alloy.Globals.configWindow($.janela, $);
		$.login.init({nome: "Login", next: $.senha});
		$.senha.init({nome: "Senha"});
		$.senha.novoNome.passwordMask = true;
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/controllers/index.js");
	}
}

CloudService.checkLogin({sucess: callbackOK, fail: abrirJanela});

function abrirJanela(){
	Alloy.Globals.Transicao.nova($, init, {});
}

function checkLogin(){
	try{
		Alloy.Globals.carregando();
		var check = Alloy.createWidget("GUI", "Mensagem");
		if($.login.getInputValue() == ""){
			check.init("Alerta", "Informe o login.");
			Alloy.Globals.carregou();
			check.show({callback: $.login.selecionar});
			return;
		}
		if($.senha.getInputValue() == ""){
			check.init("Alerta", "Preencha a senha.");
			Alloy.Globals.carregou();
			check.show({callback: $.senha.selecionar});
			return;
		}
		CloudService.checkLogin({Login: $.login.getInputValue(), Senha: $.senha.getInputValue(), sucess: callbackOK, fail: callbackNaoOK});
	}
	catch(e){
		Alloy.Globals.onError(e.message, "checkLogin", "app/widgets/Login/controllers/login.js");
	}
}

function abrirCadastro(){
	var novo = Alloy.createController("Perfil/Cadastro", {tipo: "cadastro"});
	Alloy.Globals.Transicao.proximo(novo, novo.init, {});
}
