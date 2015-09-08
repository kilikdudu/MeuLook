var args = arguments[0] || {};
$.init = function(parans, colecao){
	try{
		for(i = 0; i < parans.length; i++){
			var labelHeader = Ti.UI.createLabel({
				text: parans[i].titulo,
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				borderColor: "black",
				borderWidth: 0.5,
				color: "white",
				font: { fontSize: Alloy.Globals.CustomTitleFont },
				sortOrder: "asc",
				bindDataField: parans[i].datafield,
				height: Ti.UI.FILL,
				width: parans[i].largura
			});
			labelHeader.addEventListener("click", function(e){
				switch(e.source.sortOrder) {
					case "asc": 
						colecao.comparator = function(model){
							return model.get(e.source.bindDataField);
						};
						colecao.sort();
						e.source.sortOrder = "desc";		
						break;
					case "desc":
						colecao.comparator = function(model){
						    var str = model.get(e.source.bindDataField);
						    if(isNaN(str))
						    {
						    	str = str.toLowerCase();
							    str = str.split("");
							    str = _.map(str, function(letter) { 
							    	return String.fromCharCode(-(letter.charCodeAt(0)));
							    });
							    return str;	
						    }
						    else
						    {
						    	return -str;
						    }
						};
						colecao.sort();
						e.source.sortOrder = "asc";	
				}
			});
			$.Headers.add(labelHeader);
		}
	}
	catch(e){
		Alloy.Globals.onError(e.message, "init", "app/widgets/GUI/controllers/GRID.js");
	}
};

$.adicionarLista = function(lista){
	try{
		$.TabelaGRID.add(lista);
	}
	catch(e){
		Alloy.Globals.onError(e.message, "adicionarLista", "app/widgets/GUI/controllers/GRID.js");
	}
};
