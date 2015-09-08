/**
 * @class controllers.Index
 * Classe principal, primeira a ser executada.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

var semaforoLogin = false;

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
				 	Alloy.Globals.InfoUser = user;
	                solicitacoes.salvarCliente({sessionId: Alloy.Globals.Cloud.sessionId, id: user.id});
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
 * @property {widgets.Login.SolicitacoesLogin} solicitacoes Classe responsável por buscar o dominio da empresa vinculada ao token e validar o login e senha neste domínio.
 * @private 
 */
var solicitacoes = Alloy.createController("SolicitacoesLogin");

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
var callbackNaoOK = function(mensagem){
	try{
		Alloy.Globals.Alerta("Erro ao entrar", mensagem);
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

if(Alloy.Globals.Cliente.length > 0){
	Alloy.Globals.Cloud.sessionId = Alloy.Globals.Cliente.at(0).get("sessionId");
	Alloy.Globals.Cloud.Users.showMe(function(e){
		if (e.success) {
	        var user = e.users[0];
	        Alloy.Globals.InfoUser = user;
	        callbackOK();    
	    } else {
			Alloy.Globals.Transicao.nova($, init, {});        
	    }
	});
	
}
else{
	//Abro a janela.
	Alloy.Globals.Transicao.nova($, init, {});
}


function checkLogin(){
	try{
		Alloy.Globals.carregando();
		var check = Alloy.createWidget("GUI", "Mensagem");
		if($.login.getInputValue() == ""){
			check.init("Alerta", "Informe o login.");
			check.show({callback: $.login.selecionar});
			return;
		}
		if($.senha.getInputValue() == ""){
			check.init("Alerta", "Preencha a senha.");
			check.show({callback: $.senha.selecionar});
			return;
		}
		solicitacoes.executeLogin(callbackOK, callbackNaoOK, 
			{login: $.login.getInputValue(), senha: $.senha.getInputValue()});
	}
	catch(e){
		Alloy.Globals.onError(e.message, "checkLogin", "app/widgets/Login/controllers/login.js");
	}
}

function abrirCadastro(){
	var novo = Alloy.createController("Perfil/Cadastro", {tipo: "cadastro"});
	Alloy.Globals.Transicao.proximo(novo, novo.init, {});
}
