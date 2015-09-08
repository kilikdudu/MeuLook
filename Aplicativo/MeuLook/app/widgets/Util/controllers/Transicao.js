/**
 * @class widgets.Util.Transicao
 * Resposável por executar as transições entre as janelas. Para abrir qualquer ou fechar qualquer janela, deve-se utilizar esta classe.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

/**
 * @method proximo
 * Deve ser utilizado sempre que for necesário abrir a próxima janela.
 * Exemplo: Uma listagem de pessoas, ao clicar na linha de uma determinada pessoa, chama-se uma nova janela com os detalhes do contato da pessoa.
 * Dessa forma a rotina configura o botão voltar para a listagem de pessoas e não altera a sua tela contendo esta listagem.
 * @param {Controller} proxima Controller da próxima janela.
 * @param {Function} construtor Construtor do Controller.
 * @param {Object} [parans] Contém em suas propriedades os parâmetros necessários para o contrutor do Controller.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.proximo = function(proxima, construtor, parans){
	try{
		Alloy.Globals.carregando();
		var proximaView = proxima.getView();
		proximaView._previousWin = true;
		Alloy.Globals.pilhaWindow.push(proximaView);
		construtor(parans);
		Alloy.Globals.carregou();
		if(Ti.Platform.name === 'android'){
			proximaView.open({
				activityEnterAnimation : Ti.App.Android.R.anim.slide_in_right,
		        activityExitAnimation : Ti.App.Android.R.anim.slide_out_left
			});	
		}
		else{
			proximaView.open({transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
		}
		//Pilha de funções do botão voltar. Não utilizado no iOS.
		//Necessário para quando várias telas que configuram o botão voltar são exibidas ao mesmo tempo.
		proximaView.stackBackFunction = [];
		//Adiciona uma nova função ao botão voltar para esta janela.
		proximaView.stackBackFunction.push(function(){
			$.anterior();
		});
		//Função responsável por executar a função que está no topo da pilha de funções voltar.
		proximaView.executeBackFunction = function(){
			proximaView.stackBackFunction[proximaView.stackBackFunction.length-1]();
		};
		proximaView.addEventListener('android:back', proximaView.executeBackFunction);
		Ti.API.info("proxima window, tamanhao da pilha: " + Alloy.Globals.pilhaWindow.length);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "proximo", "app/widgets/Util/controllers/Transicao.js");
	}
};

/**
 * @method anterior
 * Fecha a janela que está no topo da pilha de Alloy.Globals.pilhaWindow e remove esta da pilha. Abre a janela que está agora no topo da pilha. 
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.anterior = function(){
	try{
		if(Alloy.Globals.currentWindow() && Alloy.Globals.currentWindow()._previousWin){
			var atual = Alloy.Globals.currentWindow();
			Alloy.Globals.pilhaWindow.pop();
			if(Ti.Platform.name === 'android'){
				atual.close({
					activityEnterAnimation : Ti.App.Android.R.anim.slide_in_left,
			        activityExitAnimation : Ti.App.Android.R.anim.slide_out_right
			    });	
			}
			else{
				atual.close({transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});
			}
		    Ti.API.info("window anterior, tamanhao da pilha: " + Alloy.Globals.pilhaWindow.length);
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "anterior", "app/widgets/Util/controllers/Transicao.js");
	}
};

/**
 * @method nova
 * Deve ser utilizado sempre que for necessário abrir uma nova hierarquia de janelas. 
 * Exemplo: Tela de Login ou então a tela de um novo serviço solicitado.
 * @param {Controller} novaJanela Controller da nova janela.
 * @param {Function} construtor Construtor do Controller.
 * @param {Object} [parans] Contém em suas propriedades os parâmetros necessários para o contrutor do Controller.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.nova = function(novaJanela, construtor, parans){
	try{
		if(Alloy.Globals.pilhaWindow.length > 0){
			Alloy.Globals.carregando();	
		}
		var novaView = novaJanela.getView();
		Alloy.Globals.pilhaWindow.push(novaView);
		construtor(parans);
		Alloy.Globals.carregou();
		if(Ti.App.name === 'android'){
			novaView.open({
				activityEnterAnimation : Ti.App.Android.R.anim.slide_in_right,
		        activityExitAnimation : Ti.App.Android.R.anim.slide_out_left
			});	
		}
		else{
			novaView.open({transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
		}
		//Flag utilizado para verificar se o botão voltar foi clicado 2 vezes.
		novaView.clickExit = 0;
		//Função que reseta a flag clickExit.
		novaView.timerFunctionReset = function(){
			novaView.clickExit = 0; 
			clearTimeout(novaView.timer);
		};
		//Pilha de funções do botão voltar. Não utilizado no iOS.
		//Necessário para quando várias telas que configuram o botão voltar são exibidas ao mesmo tempo.
		novaView.stackBackFunction = [];
		//Adiciona uma nova função ao botão voltar para esta janela.
		novaView.stackBackFunction.push(function(){
			//Quando a janela é a primeira na hierarquia de janelas, esta deve fechar o aplicativo quando o botão voltar é clicado 2 vezes seguidas em menos de 1 segundo.
			if(novaView.clickExit == 0){
				var msg = Ti.UI.createNotification({
				    message:"Clique mais uma vez para sair.",
				    duration: Ti.UI.NOTIFICATION_DURATION_SHORT
				});
				msg.show();
				novaView.clickExit = 1;
				//Espera outro clique em menos de 1 segundo.
				novaView.timer = setTimeout(novaView.timerFunctionReset, 2000);	
			}
			else{
				var activity = Titanium.Android.currentActivity;
				activity.finish();	
			}
		});
		//Função responsável por executar a função que está no topo da pilha de funções voltar.
		novaView.executeBackFunction = function(){
			novaView.stackBackFunction[novaView.stackBackFunction.length-1]();
		};
		novaView.addEventListener('android:back', novaView.executeBackFunction);
		//Ao abrir a nova janela, todas na outras janelas são fechadas.
		novaView.addEventListener("open", function(e){
			Alloy.Globals.resetPilhaWindow();
		});
		Ti.API.info("Nova window, tamanhao da pilha: " + Alloy.Globals.pilhaWindow.length);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "anterior", "app/widgets/Util/controllers/Transicao.js");
	}
};
