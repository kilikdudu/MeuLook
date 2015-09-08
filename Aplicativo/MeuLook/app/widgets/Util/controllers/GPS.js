var args = arguments[0] || {};

if(Ti.Platform.name === 'android'){
	Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_HIGH;
}
else{
	Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
}
Titanium.Geolocation.distanceFilter = 10;

var camada = Alloy.createWidget("GUI", "Camada", {load: true}).getView();

$.distLatLong =   function(lat1,lon1,lat2,lon2) {
  var R = 6371; // raio da terra
  var Lati = Math.PI/180*(lat2-lat1);  //Graus  - > Radianos
  var Long = Math.PI/180*(lon2-lon1); 
  var a = 
    Math.sin(Lati/2) * Math.sin(Lati/2) +
    Math.cos(Math.PI/180*lat1) * Math.cos(Math.PI/180*lat2) * 
    Math.sin(Long/2) * Math.sin(Long/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // distância en km
  return d;
};

$.pegaPosicaoAtual = function(callback, parans, callbackError){
	Alloy.Globals.currentWindow().add(camada);
	Titanium.Geolocation.getCurrentPosition(function(e){
	    if (!e.success || e.error)
	    {
	    	if(callbackError){
	    		callbackError({mensagem: "Não foi possível obter a sua localização, verifique se seu GPS está ativado."});	
	    	}
	        Alloy.Globals.currentWindow().remove(camada);
	        return;
	    }
	    if(callback){
	    	Alloy.Globals.currentWindow().remove(camada);
	    	callback(parans, {latitude: e.coords.latitude, longitude: e.coords.longitude});
	    }
	});
};

