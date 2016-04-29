import './chatWindow.html'
import { Messages } from '../api/messages.js'
import './message.js';

Template.chatWindow.helpers({
  messages() { //retrieves active conversations messages in the databases from client (insecure)

    const convo = Session.get('activeConvo'); //Get the active conversation from the session variable

    return Messages.find({conversationId: convo}, {sort: {sentAt : 1}}); //Return the messages for the active conversation

  },
});

Template.chatWindow.events({
"click .message-send"(event) { //Event listener that calls the messages.send method when you press the send button
  var textarea = $('.chat-input textarea'); //Find the main text area
  const text = textarea.val(); //get the text from the text area
  const convo = Session.get('activeConvo'); //Get the active conversation to post it to

  // Insert message into the collection
  Meteor.call("messages.send", convo, text)

  // Clear form
  textarea.val("");
},
"keypress .chat-input textarea"(event) {
  if(event.which == 13 && !event.shiftKey){
    event.preventDefault();
    $(".message-send").click();
  }
},
"click .message-translate"(event) {
  var textarea = $('.chat-input textarea');
  const sourceText = textarea.val();
  const sourceLang = 'en'
  const targetLang = 'ja'
  var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" 
            + sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText);

  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", url, false ); // false for synchronous request
  xmlHttp.send( null );

  var result = xmlHttp.responseText;
  while(result.indexOf(',,') !== -1){
    result = result.replace(new RegExp(',,', 'g'),',null,');
  }
  var translatedText = JSON.parse(result)[0][0][0];
  textarea.val(translatedText);
},
"mousedown .message"(event) {
  Session.set("clickedMessage", this._id);
},
"mouseup .message"(event) {
  Session.set("activeMessage",this._id);
  const clickedMessage = Session.get("clickedMessage");
  if(clickedMessage === this._id){
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    if(text !== ""){
      console.log(window.getSelection().toString())
    }
  }
  Session.set('clickedMessage',0)
},
});