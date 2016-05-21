import { Edits } from '../api/edits.js';

export const translate = function(sourceText,sourceLang,targetLang,callback){ //Translate function
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

export const getSelected = function(){ //check if any text is highlighted and grab it
  var text = "";
  if (window.getSelection) {
      text = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
      text = document.selection.createRange().text;
  }
  return text;
}

export const getSelectionTextAndContainerElement = function() { //Gets the highlighted text as well as the element that the selection is in
    var text = "", containerElement = null;
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var node = sel.getRangeAt(0).commonAncestorContainer;
            containerElement = node.nodeType == 1 ? node : node.parentNode;
            text = sel.toString();
        }
    } else if (typeof document.selection != "undefined" &&
               document.selection.type != "Control") {
        var textRange = document.selection.createRange();
        containerElement = textRange.parentElement();
        text = textRange.text;
    }
    return {
        text: text,
        containerElement: containerElement
    };
}

export const getSelectionCharOffsetsWithin = function (element) { //Function gets index of highlighted text in an element
    var start = 0, end = 0;
    var sel, range, priorRange;
    if (typeof window.getSelection != "undefined") {
        range = window.getSelection().getRangeAt(0);
        priorRange = range.cloneRange();
        priorRange.selectNodeContents(element);
        priorRange.setEnd(range.startContainer, range.startOffset);
        start = priorRange.toString().length;
        end = start + range.toString().length;
    } else if (typeof document.selection != "undefined" &&
        (sel = document.selection).type != "Control") {
        range = sel.createRange();
        priorRange = document.body.createTextRange();
        priorRange.moveToElementText(element);
        priorRange.setEndPoint("EndToStart", range);
        start = priorRange.text.length;
        end = start + range.text.length;
    }
    return {
        start: start,
        end: end
    };
}

export const rangeInEdit = function (range,message) { //Checks if a range is already in the range of another edit
  return Edits.findOne(
    { $or : [
      { $and : [
        {messageId : message},
        {"location.start": { $lte : range.start }},
        {"location.end" : { $gt : range.start }}
      ]},
      { $and : [
        {messageId : message},
        {"location.start": { $lt : range.end }},
        {"location.end" : { $gte : range.end }}
      ]}
    ]})
}