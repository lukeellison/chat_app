import './chatWindow.html'
import { Messages } from '../api/messages.js'
import './message.js';
import './editing.js'
import { translate } from './helpers.js'
import { getSelected } from './helpers.js'

Template.chatWindow.helpers({
  messages() { //retrieves active conversations messages in the databases from client (insecure)

    const convo = Session.get('activeConvo'); //Get the active conversation from the session variable

    return Messages.find({conversationId: convo}, {sort: {sentAt : 1}}); //Return the messages for the active conversation

  },
  messageActive(){ //Checks to see if a message is currently selected
    return Session.get("activeMessage") != undefined
  }
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
"keypress .chat-input textarea"(event) { //enter key sends message
  if(event.which == 13 && !event.shiftKey){ //unless shift+enter
    event.preventDefault();
    $(".message-send").click();
  }
},
"click .message-translate"(event) { //temporarily translates text in the textarea and replaces it in the input
  const textarea = $('.chat-input textarea');
  translate(textarea.val(), "en", "ja",function(translatedText){ //hardcoded english to japanese at the moment
    textarea.val(translatedText);
  });
},
"mousedown .message"(event) { //Checks which message the mouse button was pressed on for highlighting
  Session.set("clickedMessage", this._id);
}, 
"mouseup .message"(event) { //event for clicking on messages and sets the selectedText session variable limited to 100 charactars
  Session.set("activeMessage",this._id); //set this message as active
  const clickedMessage = Session.get("clickedMessage");
  if(clickedMessage === this._id){ //if the mouse also went down on this message then text might be highlighted in this message
    const text = getSelected();
    if(text !== "") //if there was nothing highlighted
      Session.set('selectedText',text.substr(0,100)); //just use the whole message (100 char limit)
    else
      Session.set('selectedText',this.text.substr(0,100)); //otherwise use the highlighted text (100 char limit)
  }
  Session.set('clickedMessage',undefined) //if the mouse came back up elsewhere then cancel the mousedown event
},
});