/**
 * @class widgets.Login.SolicitacoesLogin
 * Responsável pelas rotinas que valida o token da empresa no SuportNet e validar o login e senha no domínio da empresa.
 * @private
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

/**
 * @property {Function} sucessoLogin Caso o login seja validado, esta rotina será executada. 
 * @private 
 */
var sucessoLogin = null;
/**
 * @property {Function} failLogin Caso o login não seja validado, esta rotina será executada. 
 * @private 
 */
var failLogin = null;

/**
 * @property {Object} info Dados de login e senha.
 * @property {String} info.login Login do usuário.
 * @property {String} info.senha Senha do usuário.
 * @private 
 */
var info = null;

/**
 * @event sucessAcesslogin
 * Rotina executada no sucesso a validação do login e senha.
 * @param {BackBone.Collection} ret Coleção retornada pelo WebService AutentificadorMob.asmx/AutentificarUsuarioTitanium 
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function sucessAcesslogin(e){
	try{
		if(e.success){
			var user = e.users[0];
			Alloy.Globals.InfoUser = user;
			$.salvarCliente({sessionId: Alloy.Globals.Cloud.sessionId, id: user.id});
			sucessoLogin();	
		}
		else{
			failLogin(e.message);
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "sucessAcesslogin", "app/widgets/Login/controllers/SolicitacoesLogin.js");
	}
}

$.salvarCliente = function(parans){
	try{
		if(parans.sessionId && parans.id){
			Alloy.Globals.DAL.destroyColecao(Alloy.Globals.Cliente);
			var user= {sessionId: parans.sessionId, id: parans.id};
			var cliente = Alloy.createModel("Cliente", user);
			Alloy.Globals.Cliente.add(cliente);
			cliente.save();
			Alloy.Globals.Cliente.fetch();
		}
		else{
			Alloy.Globals.onError("Parâmetros incorretos", "sucessAcesslogin", "app/widgets/Login/controllers/SolicitacoesLogin.js");
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "sucessAcesslogin", "app/widgets/Login/controllers/SolicitacoesLogin.js");
	}
	
};

/**
 * @method executeLogin
 * Método responsável por validar o token, login e senha.
 * @param {Function} callOK Rotina utilizada em widgets.Login.SolicitacoesLogin.sucessoLogin
 * @param {Function} callFail widgets.Login.SolicitacoesLogin.failLogin
 * @param {String} token Token que referencia a empresa dentro do SuporteNet.
 * @param {String} dados Objeto do tipo widgets.Login.SolicitacoesLogin.info
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.executeLogin = function(callOK, callFail, dados){
	info = dados;
	sucessoLogin = callOK;
	failLogin = callFail;
	validaUsuarioSenha();
};



/**
 * @method validaUsuarioSenha
 * Valida o login e a senha.
 * @param {BackBone.Collection} ret Coleção retornada pelo WebService wsempresa.asmx/CarregarConfPortalEmpresaMobile
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function validaUsuarioSenha(){
	try{
		Cloud.Users.login({
		    login: info.login,
		    password: info.senha
		}, sucessAcesslogin);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "validaUsuarioSenha", "app/widgets/Login/controllers/SolicitacoesLogin.js");
	}	
}