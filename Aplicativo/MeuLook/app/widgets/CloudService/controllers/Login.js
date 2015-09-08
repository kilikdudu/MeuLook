/**
 * @class widgets.CloudService.Login
 * Realiza o login do usuário na nuvem do appcelerator.
 * @alteracao 23/07/2015 183484 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
var args = arguments[0] || {};


$.checkLogin = function(parans){
	if(parans.Login){
		Alloy.Globals.Cloud.Users.login({
			login: parans.Login,
			password: parans.Senha
		}, function (e) {
		    if (e.success) {
		        var user = e.users[0];
		        gravaUsuario(user);
		        //solicitaInscricaoCanal(parans.tokenEmpresa);
		        parans.sucess();
			} else {
			    Ti.API.info('Error:\n' +
			            ((e.error && e.message) || JSON.stringify(e)));
			    parans.fail({message: "Login ou senha incorretos."});
			}
		});	
	}
	else{
		var localUsers = Widget.createCollection("CloudUser");
		localUsers.fetch();
		if(localUsers.length > 0){
			Alloy.Globals.Cloud.sessionId = localUsers.at(0).get("SessionId");
			Alloy.Globals.Cloud.Users.showMe(function(e){
				if (e.success) {
			        var user = e.users[0];
			        Alloy.Globals.InfoUser = user;
			        parans.sucess();   
			    } else {
					parans.fail();       
			    }
			});
			
		}
		else{
			parans.fail(); 
		}
	}	
};


function gravaUsuario(user){
	var usuarios = Widget.createCollection("CloudUser");
	usuarios.fetch();
	Alloy.Globals.DAL.destroyColecao(usuarios);
	var usuario = Widget.createModel("CloudUser", {CloudId: user.id, Login: user.username, SessionId: Alloy.Globals.Cloud.sessionId});
	usuario.save();
	//Coloco as informações de usuário em uma variável global.
	Alloy.Globals.InfoUser = user;
}

$.gravaUsuario = gravaUsuario;

function solicitaInscricaoCanal(token){
	var inscricaoController = Widget.createController("Notificacao");
	inscricaoController.CadastroNotificacoes({token: token});
}
