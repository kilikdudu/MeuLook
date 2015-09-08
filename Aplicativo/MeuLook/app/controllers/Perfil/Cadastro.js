/**
 * @class controllers.Boletos
 * Lista boletos.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

var tipo = args.tipo;

configuraInput();

if(tipo == "cadastro"){
	$.btnConcluir.title = "Concluir";
}else{
	$.btnConcluir.title = "Atualizar";
	$.login.setEnabled(false);
	$.login.setDesc("Login");
	$.nome.setDesc("Nome");
	$.sobrenome.setDesc("Sobrenome");
	PreencheDados();
	ativaBtnSenha();
}

/**
 * @event sucesso
 * Conseguiu obter os boletos do WebService.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
function callbackOk(e){
	try{
		var alerta = Alloy.createWidget("GUI", "Mensagem");
		alerta.init("Sucesso", "Cadastro realizado. usuário id: " + e.users[0].id);
		alerta.show({callback: voltar});
	}
	catch(e){
		Alloy.Globals.onError(e.message, "sucesso", "app/controllers/Cadastro.js");
	}
}

var callbackNaoOK = function(e){
	try{
		Alloy.Globals.Alerta("Erro ao tentar cadastrar", e.message);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "callbackNaoOK", "app/controllers/index.js");
	}
};

function voltar(){
	try{
		var login = Alloy.createController("index");
	}
	catch(e){
		Alloy.Globals.onError(e.message, "voltar", "app/controllers/Cadastro.js");
	}
}

/**
 * @method init
 * Construtor da classe.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.init = function(){
	try{
		Alloy.Globals.configWindow($.winCadastro, $);
		$.minhaTopBar.iniciar(tipo=="cadastro"?"Cadastro":"Dados Pessoais");
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/controllers/Boletos.js");
	}
};

function configuraInput(){
	$.nome.init({nome: "*Nome", next: $.sobrenome});
	$.sobrenome.init({nome: "*Sobrenome", next: $.email});
	$.dataNascimento.init({nome: "*Data de nascimento"});
	$.email.init({nome: "Email", next: $.cpf, keyboardType: Titanium.UI.KEYBOARD_EMAIL});
	if(tipo == "cadastro"){
		$.cpf.init({nome: "CPF", next: $.login, keyboardType: Titanium.UI.KEYBOARD_NUMBER_PAD});
		$.login.init({nome: "*Login", next: $.senha});
		$.senha.init({nome: "*Senha", next: $.senhaRep});
		$.senhaRep.init({nome: "*Senha novamente"});
	}else{
		$.cpf.init({nome: "CPF", keyboardType: Titanium.UI.KEYBOARD_NUMBER_PAD});
	}
	$.senha.novoNome.passwordMask = true;
	$.senhaRep.novoNome.passwordMask = true;
}

function ativaBtnSenha(){
	$.boxSenha.top = 0;
	$.boxSenha.height = 0;
	$.boxSenhaRep.top = 0;
	$.boxSenhaRep.height = 0;
	$.btnAlterarSenha.enabled = true;
	$.btnAlterarSenha.height = Ti.UI.SIZE;
	$.btnAlterarSenha.top = 10;
}

function validaCpf(e){
	if(e.text == ""){
		return ;
	}
	if(Alloy.Globals.validador.validarCPF(e.text)){
			e.source.value = Alloy.Globals.format.cpf(e.text);
	}else{
		Alloy.Globals.Alerta("Alerta", "CPF inválido");
		e.source.value = Alloy.Globals.format.soDigitos(e.text);
	}
	
}

function validaEmail(e){
	if(e.text == ""){
		return ;
	}
	if(!Alloy.Globals.validador.validarEmail(e.text)){
		Alloy.Globals.Alerta("Alerta", "Email inválido");
	}
}

function validar(){
	try{
		var check = Alloy.createWidget("GUI", "Mensagem");
		if($.nome.getInputValue() == ""){
			check.init("Alerta", "Informe o seu nome.");
			check.show({callback: $.nome.selecionar});
			return false;
		}
		if($.sobrenome.getInputValue() == ""){
			check.init("Alerta", "Informe o sobrenome.");
			check.show({callback: $.sobrenome.selecionar});
			return false;
		}
		if($.dataNascimento.getSelected().data == ""){
			check.init("Alerta", "Informe a data de nascimento.");
			check.show({callback: $.dataNascimento.selecionar});
			return false;
		}
		if($.login.getInputValue() == "" && tipo == "cadastro"){
			check.init("Alerta", "Informe o login.");
			check.show({callback: $.login.selecionar});
			return false;
		}
		if($.senha.getInputValue() == "" && tipo == "cadastro"){
			check.init("Alerta", "Preencha a senha.");
			check.show({callback: $.senha.selecionar});
			return false;
		}
		if($.senhaRep.getInputValue() == "" && tipo == "cadastro"){
			check.init("Alerta", "Preencha a senha novamente.");
			check.show({callback: $.senhaRep.selecionar});
			return false;
		}
		if($.senhaRep.getInputValue() != $.senha.getInputValue() && tipo == "cadastro"){
			check.init("Alerta", "As senhas devem ser iguais.");
			$.senhaRep.setInputValue("");
			check.show({callback: $.senhaRep.selecionar});
			return false;
		}
		if($.cpf.getInputValue() != ""){
			if(!Alloy.Globals.validador.validarCPF($.cpf.getInputValue())){
				check.init("Alerta", "CPF inválido.");
				check.show({callback: $.cpf.selecionar});
				return false;
			}
		}
		if($.email.getInputValue() != ""){
			if(!Alloy.Globals.validador.validarEmail($.email.getInputValue())){
				check.init("Alerta", "Email inválido.");
				check.show({callback: $.email.selecionar});
				return false;
			}
		}
		return true;
	}
	catch(e){
		Alloy.Globals.onError(e.message, "checkLogin", "app/widgets/Login/controllers/login.js");
	}
}

function cadastro(){
	if(validar()){
		if(tipo == "cadastro"){
			requestCadastro();	
		}else{
			alteraDados();
		}
	}
}

function requestCadastro(){
	try{
		Alloy.Globals.carregando();
		// example assumes you have a set of text fields named username, password, etc.
		Alloy.Globals.Cloud.Users.create({
		    username: $.login.getInputValue(),
		    password: $.senha.getInputValue(),
		    password_confirmation: $.senhaRep.getInputValue(),
		    first_name: $.nome.getInputValue(),
		    last_name: $.sobrenome.getInputValue(),
		    email: $.email.getInputValue(),
		    custom_fields: {cpf: $.cpf.getInputValue(), datanascimento: Alloy.Globals.format.customFormatData($.dataNascimento.getSelected().data, "DD/MM/YYYY", "YYYY/MM/DD")}
		}, function (e) {
			if (e.success) {
			 	callbackOk(e);
		    } else {
		 		callbackNaoOK(e);
		    }
		    Alloy.Globals.carregou();
		});
	}
	catch(e){
		Alloy.Globals.onError(e.message, "requestCadastro", "app/controllers/Cadastro.js");
	}
}

function alteraDados(){
	try{
		Alloy.Globals.carregando();
		// example assumes you have a set of text fields named username, password, etc.
		Alloy.Globals.Cloud.Users.update({
		    first_name: $.nome.getInputValue(),
		    last_name: $.sobrenome.getInputValue(),
		    email: $.email.getInputValue(),
		    custom_fields: {cpf: $.cpf.getInputValue(), datanascimento: Alloy.Globals.format.customFormatData($.dataNascimento.getSelected().data, "DD/MM/YYYY", "YYYY/MM/DD")}
		}, function (e) {
			if (e.success) {
				var user = e.users[0];
				Alloy.Globals.InfoUser = user;
			 	Alloy.Globals.Alerta("Sucesso", "Dados alterados com sucesso.");
		    } else {
		 		Alloy.Globals.Alerta("Erro", "Ocorreu um erro ao tentar atualizar os seus dados.\nTente novamente em alguns instantes.");
		    }
		    Alloy.Globals.carregou();
		});
	}
	catch(e){
		Alloy.Globals.onError(e.message, "alteraDados", "app/controllers/Cadastro.js");
	}
}

function PreencheDados(){
    $.nome.setInputValue(Alloy.Globals.InfoUser.first_name);
    $.sobrenome.setInputValue(Alloy.Globals.InfoUser.last_name);
    $.email.setInputValue(Alloy.Globals.InfoUser.email);
    if(Alloy.Globals.InfoUser.custom_fields){
    	$.dataNascimento.setSelected({valor: Alloy.Globals.InfoUser.custom_fields.datanascimento});
    	$.cpf.setInputValue(Alloy.Globals.InfoUser.custom_fields.cpf);
    }
    if(Alloy.Globals.InfoUser.external_accounts.length > 0){
    	$.login.setInputValue("Vinculado ao facebook");
    }else{
    	$.login.setInputValue(Alloy.Globals.InfoUser.username);
    }   
}
