var args = arguments[0] || {};

$.init = function(){
	try{
		Alloy.Globals.configPopUp($);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/widgets/GUI/controllers/TelaLog.js");	
	}
};

$.setMensagem = function(value){
	$.mensagem.setText(value);
};

function clickOk(){
	$.close();
}