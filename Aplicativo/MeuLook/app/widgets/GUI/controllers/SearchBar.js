var args = arguments[0] || {};

if(args.autoSearch){
	$.boxSearchView.remove($.btnBuscar);
	$.linhaBaixo.setRight(10);
	$.input.setRight(10);
}

$.input.setReturnKeyType(Ti.UI.RETURNKEY_SEARCH);
$.input.addEventListener("return", function(e){
	buscar();
});

function buscar(e){
	$.trigger('busca', {
    	source: $,
    	value: $.input.getValue()
    });
    $.input.blur();
}

$.getValue = function(){
	return $.input.getValue();
};

$.tirarFoco = function(){
	$.input.blur();
};

function alterando(e){
	$.trigger('change', {
    	source: e.source,
    	value: e.value
    });
}