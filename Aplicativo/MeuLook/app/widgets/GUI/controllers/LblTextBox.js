var args = arguments[0] || {};

$.init = function(parans){
	if(parans.nome){
		$.lblDesc.text = parans.nome;
	}
	return null;
};

$.getInputValue = function(){
	return $.desc.value;
};

$.setDesc = function(desc){
	$.lblDesc.text = desc;
};

$.setInputValue = function(value){
	$.desc.value = value;
};
$.desfocar = function(){
	$.desc.blur();
};


$.desc.addEventListener('singletap', function() {
	if(Ti.Platform.name === 'android'){
		$.desc.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
	}
	$.desc.focus();
});

$.desc.addEventListener('click', function() {
	if(Ti.Platform.name === 'android'){
		$.desc.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
	}
	$.desc.focus();
});
	    
$.desc.addEventListener('blur', function() {
	if(Ti.Platform.name === 'android'){
    	$.desc.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS;
    }
});