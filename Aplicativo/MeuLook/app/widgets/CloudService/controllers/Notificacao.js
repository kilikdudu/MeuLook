/**
 * @class widgets.CloudService.Notificacao
 * Trata o cadastro em canais de notificação.
 * @alteracao 23/07/2015 183484 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação. 
 */
var args = arguments[0] || {};

var empresaToken;

$.CadastroNotificacoes = function(parans){
	empresaToken = parans.token;
	getDeviceToken();
};

function getDeviceToken(){
	if(Ti.Platform.name == "iPhone OS"){
		getDeviceTokeniOS();
	}
	else if(Ti.Platform.name == 'android'){
		getDeviceTokenAndroid();
	}
}

function getDeviceTokenAndroid(){
	// Require the module
	var CloudPush = require('ti.cloudpush');
	 
	// Initialize the module
	CloudPush.retrieveDeviceToken({
	    success: deviceTokenSuccess,
	    error: deviceTokenError
	});
	CloudPush.showTrayNotificationsWhenFocused = false;
	CloudPush.singleCallback = true; 
	// Process incoming push notifications
	CloudPush.addEventListener('callback', receivePush);
}

function getDeviceTokeniOS(){
	// Check if the device is running iOS 8 or later
	if (parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
	 
		// Wait for user settings to be registered before registering for push notifications
	    Ti.App.iOS.addEventListener('usernotificationsettings', function registerForPush() {
	        // Remove event listener once registered for push notifications
	        Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush); 
	 
	        Ti.Network.registerForPushNotifications({
	            success: deviceTokenSuccess,
	            error: deviceTokenError,
	            callback: receivePush
	        });
	    });
	 
	    // Register notification types to use
	    Ti.App.iOS.registerUserNotificationSettings({
		    types: [
	            Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
	            Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,
	            Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE
	        ]
	    });
	}
	 
	// For iOS 7 and earlier
	else {
	    Ti.Network.registerForPushNotifications({
	        // Specifies which notifications to receive
	        types: [
	            Ti.Network.NOTIFICATION_TYPE_BADGE,
	            Ti.Network.NOTIFICATION_TYPE_ALERT,
	            Ti.Network.NOTIFICATION_TYPE_SOUND
	        ],
	        success: deviceTokenSuccess,
	        error: deviceTokenError,
	        callback: receivePush
	    });
	}
}


// Process incoming push notifications
function receivePush(e) {
	Ti.API.info(JSON.stringify(e));
	var dados = JSON.parse(e.payload);
    var check = Alloy.createWidget("GUI", "Mensagem");
	check.init("Notificação", dados.mensagem, true);
	check.setConfirmText("Ver");
	check.setCancelText("Ignorar");
	check.show({callback: function(ret){ 
			if(ret.value){
				Titanium.App.fireEvent("notificacao", dados); 
			}
		}
	});	
}
// Save the device token for subsequent API calls
function deviceTokenSuccess(e) {
    Alloy.Globals.DeviceToken = e.deviceToken;
    inscricaoCanal();
}
function deviceTokenError(e) {
    Ti.API.info('Failed to register for push notifications! ' + e.error);
}


function inscricaoCanal(){
	var canaisUsuario = Widget.createCollection("Inscricao");
	canaisUsuario.fetch();
	for(var i = 0; i < Alloy.Globals.CanaisNotificacao.length; i++){
		var canal = Alloy.Globals.CanaisNotificacao[i];
		if(canaisUsuario.length > 0){
			if(canaisUsuario.where({canal: canal}).length == 0){
				realizarInscricao(canal);
			}
		}else{
			realizarInscricao(canal);
		}
	}
}

function realizarInscricao(canal){
	Alloy.Globals.Cloud.PushNotifications.subscribe({
        device_token: Alloy.Globals.DeviceToken,
        channel: canal + "_" + empresaToken,
        type: Ti.Platform.name == 'android' ? 'android' : 'ios'
    }, function (e) {
        if (e.success) {
            Ti.API.info('Inscrito no canal: ' + canal + "_" + empresaToken);
            gravaCanal(canal);
        } else {
            Ti.API.info('Erro inscrição canal:\n' + ((e.error && e.message) || JSON.stringify(e)));
        }
    });
}

function gravaCanal(canal){
	var usuarioCanal = Widget.createModel("Inscricao", {canal: canal, data: new Date().toDateString()});
	usuarioCanal.save();
}
