var args = arguments[0] || {};

Alloy.Globals.configPopUp($, configurarOrientacao);

var confirmarCallback = args.confirmarCallback;
var cancelarCallback = args.cancelarCallback;

var orientationBackup;

var Paint = require('ti.paint');

var paintView = Paint.createPaintView({
    top:0, right:0, bottom:0, left:0,
    // strokeWidth (float), strokeColor (string), strokeAlpha (int, 0-255)
    strokeColor:'#000000', strokeAlpha:255, strokeWidth:3,
    eraseMode:false
});

var linha = Ti.UI.createView({
	width: "80%",
	height: 1,
	bottom: "30%",
	backgroundColor: "black"
});

$.boxAssinatura.add(paintView);
$.boxAssinatura.add(linha);

function configurarOrientacao(){
	orientationBackup = Alloy.Globals.currentWindow().getOrientationModes();
	Alloy.Globals.currentWindow().setOrientationModes([Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT]);
}

function fechar(){
	Alloy.Globals.currentWindow().setOrientationModes(orientationBackup);
	$.close();
}

function limpar(){
	 paintView.clear();
}
