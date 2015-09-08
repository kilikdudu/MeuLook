/**
 * @class widgets.CloudService.Login
 * Realiza o login do usuário na nuvem do appcelerator.
 * @alteracao 23/07/2015 183484 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
var args = arguments[0] || {};


$.checkLogin = function(parans){
	var dados = geraDadosusuario(parans.clienteId, parans.tokenEmpresa, parans.tipo);
	Ti.API.info(JSON.stringify(dados));
	var localUsers = Widget.createCollection("CloudUser");
	localUsers.fetch();
	var localUser = localUsers.where({CodigoUAU: dados.idUsuarioUAU})[0];
	if(localUser){
		localUser = localUser.toJSON();
		Alloy.Globals.Cloud.sessionId = localUser.SessionId;
		solicitaInscricaoCanal(parans.tokenEmpresa);
	}else{
		Alloy.Globals.Cloud.Users.login({
			login: dados.userLogin,
			password: dados.senha
		}, function (e) {
		    if (e.success) {
		        var user = e.users[0];
		        gravaUsuario(user, dados.idUsuarioUAU);
		        solicitaInscricaoCanal(parans.tokenEmpresa);
			} else {
			    Ti.API.info('Error:\n' +
			            ((e.error && e.message) || JSON.stringify(e)));
			    Ti.API.info("Código usuario: " + parans.clienteId + '\nToken empresa: ' + parans.tokenEmpresa + '\nSenha: ' + dados.senha);
			    cadastrarUsuario(dados);
			}
		});	
	}
};

function cadastrarUsuario(dados){
	Alloy.Globals.Cloud.Users.create({
		username: dados.userLogin,
	    password: dados.senha,
	    password_confirmation: dados.senha
	}, function (e) {
	    if (e.success) {
	        var user = e.users[0];
	        gravaUsuario(user, dados.idUsuarioUAU);
	        solicitaInscricaoCanal(dados.tokenEmpresa); 
	    } else {
	        Ti.API.info('Error:\n' +
	            ((e.error && e.message) || JSON.stringify(e)));  
	    }
	});
};

function geraDadosusuario(id, token){
	var userLogin = token + "_" + id + "_" + tipo;
	var senha = Ti.Utils.md5HexDigest(token + id);
	return {userLogin: userLogin, senha: senha, idUsuarioUAU: id, tokenEmpresa: token};
}

function gravaUsuario(user, usuarioUAUId){
	var usuarios = Widget.createCollection("CloudUser");
	usuarios.fetch();
	Alloy.Globals.DAL.destroyColecao(usuarios);
	var usuario = Widget.createModel("CloudUser", {CodigoUAU: usuarioUAUId, CloudId: user.id, Login: user.username, SessionId: Alloy.Globals.Cloud.sessionId});
	usuario.save();
	//Coloco as informações de usuário em uma variável global.
	Alloy.Globals.CloudUser = usuario.toJSON();
}

function solicitaInscricaoCanal(token){
	var inscricaoController = Widget.createController("Notificacao");
	inscricaoController.CadastroNotificacoes({token: token});
}
