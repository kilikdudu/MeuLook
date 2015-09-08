/**
 * @class widgets.Util.Erro
 * Controller da tela de erro. 
 * Todo erro não tratado da aplicação é exibido por este controller.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

$.descUsuario.init({nome: "Descreva o que estava fazendo"});

var descricaoErro = null;
var rotinaErro = null;
var arquivoErro = null;

$.show = function(descricao, rotina, arquivo){
	try{
		$.descErro.text = "Bem, isso é embaraçoso ...\n" + "O sistema identificou o seguinte erro:\n";
		$.descErro.text = $.descErro.text + "Erro: " + descricao + "\nRotina: " + rotina + "\nArquivo: " + arquivo;
		descricaoErro = descricao;
		rotinaErro = rotina;
		arquivoErro = arquivo;
		if(Alloy.Globals.MainDomain == null){
			$.btnEnviar.enabled = false;
			$.btnEnviar.opacity = 0.6;
		}
		Alloy.Globals.currentWindow().add($.boxErro);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "show", "app/widgets/Util/controllers/Erro.js");
	}
};

function cancelarClick(e){
	reiniciar();
}

function enviarClick(e){
	try{
		if(Alloy.Globals.MainDomain == null){
			reiniciar();
			return ;
		}
		var novoWebService = Alloy.createWidget("WebService");
		var httpRequest = novoWebService.iniciarHttpRequest({
			url: Alloy.Globals.MainDomain + "api/Configuracao/gravaLogErro", 
			metodo: "POST",
			callback: reiniciar,
			error: reiniciar,
			timeout: 60000
		});
		if(httpRequest){
			httpRequest.adicionaParametro({descricao: descricaoErro, classe: arquivoErro, metodo: rotinaErro, os: Ti.Platform.name, aplicativo: "UAU Boleto", 
				versao: Ti.App.version, atividade: $.descUsuario.getInputValue()});
			httpRequest.NovoEnvia();	
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "enviarClick", "app/widgets/Util/controllers/Erro.js");
	}
}

function reiniciar(){
	Alloy.createController("index");
};
