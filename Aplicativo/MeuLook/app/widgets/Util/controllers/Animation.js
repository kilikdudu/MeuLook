/**
 * @class widgets.Util.Animations
 * Animações genéricas.
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
var args = arguments[0] || {};

/**
 * Animação do click do botão. 
 * @param {Object} controle
 * @alteracao 21/01/2015 176562 Projeto Carlos Eduardo Santos Alves Domingos
 * Criação.
 */
$.animarClick = function(controle){
	var animacao = Ti.UI.createAnimation({
		backgroundColor: "#B6B6B6",
		duration: 50,
		autoreverse: true
	});
	controle.animate(animacao);
};


$.dragToLocation = function(controle, controlePai, acao){
	// object to store last event position
	var valueX = 0; 
	var valueY = 0;
	var ativado = false; 
	var put = {};
	var destinationView = Ti.UI.createView({width: 0, height: 0, right : 0});
	var tempView = Ti.UI.createView({
		width: controle.width,
		height: controle.height,
		top: controle.top,
		left: controle.left,
		backgroundColor: 'transparent'
	});
	
	controlePai.add(tempView);
	controlePai.add(destinationView);
	
	tempView.addEventListener("click", function(e){
		controle.fireEvent("click", e);
	});
	
	tempView.addEventListener('touchstart', startPosition);
	 
	 
	tempView.addEventListener('touchmove', movingPosition);
	
	tempView.addEventListener('touchend', decessionMaking);
	
	function startPosition(e)
	{
	    put.x = parseInt(e.x) - controle.left.toString().split("px")[0];
	    put.y = parseInt(e.y) - controle.top.toString().split("px")[0];
	}
	 
	function movingPosition(e)
	{	
		var flagMovimentoHorizontal = parseInt(e.x) - put.x;
		var flagMovimentoVertical = parseInt(e.y) - put.y;
		if(flagMovimentoHorizontal > 0){
			controle.left = flagMovimentoHorizontal + "px";	
		}
		/*if(flagMovimentoVertical > 0){
			controle.top = flagMovimentoVertical + "px";	
		} */
		if (fingerSlideCollider(tempView, destinationView, e)) {
			ativado = true;
			tempView.removeEventListener('touchstart', startPosition);
			tempView.removeEventListener('touchmove', movingPosition);
			tempView.removeEventListener('touchend', decessionMaking);
			acao();
		}
	}
	
	function decessionMaking(e)
	{
	    //CheckingPositon(e.x - put.x,e.y - put.y);
	    if(ativado){
	    	return;
	    }
	    var animacaoPosicionar = Ti.UI.createAnimation({
	    	top: valueX,
	    	left: valueY,
	    	duration: 100
	    });
	    controle.animate(animacaoPosicionar);
	    tempView.animate(animacaoPosicionar);
	}
	
	function fingerSlideCollider(originObj, targetObj, e){
	    var pointRelativeToTarget = originObj.convertPointToView({x:e.x, y:e.y}, targetObj);
		var x = pointRelativeToTarget.x;
		var y = pointRelativeToTarget.y;
		var onX = (x > -35);
		return onX;
		/*var onX = (x > 0) && (x < targetObj.rect.width);
		var onY = (y > 0 ) && (y < targetObj.rect.height);
	    return (onX && onY);*/	
	};
	
};

/**
 * @method loaderAnimation
 * Cria a animação de loading.
 * @param {Ti.UI.ImageView} imgView
 */
$.loaderAnimation = function(imgView){
	imgView.images = $.getImagesLoader();
	imgView.start();
};

$.getImagesLoader = function(){
	var imagens = [];
	for(var i = 0; i < 12; i++){
		imagens.push("/images/load/" + i + ".png");
	}
	return imagens;
};
