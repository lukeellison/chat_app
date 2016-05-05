export const translate = function(sourceText,sourceLang,targetLang,callback){
	const url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" 
 				+ sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText);

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
          var result = xmlHttp.responseText;
          while(result.indexOf(',,') !== -1){
            result = result.replace(new RegExp(',,', 'g'),',null,');
          }
          callback(JSON.parse(result)[0][0][0]);
        }
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}
