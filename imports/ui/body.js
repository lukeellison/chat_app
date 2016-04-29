import { Template } from 'meteor/templating';

import './body.html'; //Load body html
import '../../client/main.css';
import '../api/messages.js'; //Load Messages database collection and methods
import '../api/conversations.js';

import { Conversations } from '../api/conversations.js'
import { Messages } from '../api/messages.js';

import './conversation.js';
import './message.js';
import './helpers.js';

Template.body.onCreated(function bodyOnCreated() {
  Meteor.subscribe('convos');
  Meteor.subscribe('messages')
});

Template.body.helpers({
  messages() { //retrieves active conversations messages in the databases from client (insecure)

    const convo = Session.get('activeConvo'); //Get the active conversation from the session variable

    return Messages.find({conversationId: convo}, {sort: {sentAt : 1}}); //Return the messages for the active conversation

  },

  conversations() { //retrives conversations that this user is in
    const id = Meteor.userId();

    return Conversations.find({ "users.ids" : id })
  }
});

Template.body.events({
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
"click .btn-matchmake"(event) { //Event listener that calls the matchmake method when you press the matchmake button

  Meteor.call('conversations.matchmake');

//  Meteor.call("conversations.new", "Kd5NSiiw4uTuaXYdC", ["Luke", "Jeff", "Jeff2"]); //Temporarily using this to just make convos
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
"click"(event) {
  const target = event.target; 
  if(!($(event.target).parent(".message").length>0 || $(event.target).is(".message"))) {
    Session.set("activeMessage",0)
  }
}
});
