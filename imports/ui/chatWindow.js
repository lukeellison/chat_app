import './chatWindow.html'
import { Messages } from '../api/messages.js'
import { Edits } from '../api/edits.js'
import './message.js';
import './editing.js'

//Import helper functions
import { translate } from './helpers.js'
import { getSelected } from './helpers.js'
import { getSelectionCharOffsetsWithin } from './helpers.js'
import { rangeInEdit } from './helpers.js'

Template.chatWindow.helpers({
  messages() { //retrieves active conversations messages in the databases from client (insecure)

    const convo = Session.get('activeConvo'); //Get the active conversation from the session variable

    return Messages.find({conversationId: convo}, {sort: {sentAt : 1}}); //Return the messages for the active conversation

  },
  selectedText(){ //Checks to see if any text is selected for showing the editing window
    return Session.get("selectedText") !== undefined 
  },
  inputTitle(){ //A message to explain what is being edited
    const range = Session.get('selectedTextRange')
    if(range){ 
      if(rangeInEdit(range,Session.get('activeMessage'))){
        return "Modifying selected edit:"        
      }
      else return "New edit of selected part of message:"
    }
    else return "New message:"
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
  const target = event.target; 
  console.log("mousedown in " + this._id)
  if($(target).is(".message-text") || $(target).parent().is(".message-text")){ //check if you clicked inside the text (accounting for corrections)
    Session.set("clickedMessage", this._id); //Sets a session varibles to limit highlighting within this message
  }
}, 
"mouseup .message"(event) { //text has been highlighted event
  Session.set("activeMessage",this._id); //set this message as active if it was clicked
  const target = event.target;
  console.log("mouseup in " + this._id)
  console.log(target)

  const clickedMessage = Session.get("clickedMessage");
  if(clickedMessage === this._id){ //if the mouse also went down on this message then text might be highlighted in this message
    var range = undefined; 
    if($(target).is(".message-text")){
      range = getSelectionCharOffsetsWithin(target);
    }
    else if($(target).is(".Correction")){
      range = getSelectionCharOffsetsWithin(target.parentElement);
    }

    const edit = rangeInEdit(range,this._id);
    if(range && edit === undefined){
      if(range.start !== range.end){
        Session.set('selectedText',getSelected());
        Session.set('selectedTextRange',range);
      }
      else{
        Session.set('selectedText',undefined);
        Session.set('selectedTextRange',undefined);        
      }
    }
    else if(range && edit){
      Session.set('selectedText',edit.edit)
      Session.set('selectedTextRange',edit.location)
      Session.set('activeEdit',edit._id)
    }
  }

  Session.set('clickedMessage',undefined) //cancel the mousedown event
},
});
