import './chatWindow.html'
import { Messages } from '../api/messages.js'
import { Edits } from '../api/edits.js'
import './message.js';
import './editing.js'

//Import helper functions
import { translate } from './helpers.js'
import { getSelectionTextAndContainerElement } from './helpers.js'
import { getSelectionCharOffsetsWithin } from './helpers.js'
import { rangeInEdit } from './helpers.js'


Template.chatWindow.helpers({
  activeConvo(){
    return Session.get('activeConvo') != undefined
  },
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

"mouseup .message-text"(event) { //text has been highlighted event
  Session.set("activeMessage",this._id); //set this message as active if it was clicked
  const selection = getSelectionTextAndContainerElement();
  const selectionEl = selection.containerElement;

  if($(selectionEl).is(".message-text") || $(selectionEl).is(".edit")){ //if the selection is contained within a message text element
    var messageEl = undefined;
    if($(selectionEl).is(".message-text")) messageEl = selectionEl;
    else if($(selectionEl).is(".edit")) messageEl = selectionEl.parentElement;
    
    var range = getSelectionCharOffsetsWithin(messageEl);
    const edit = rangeInEdit(range,this._id); //If the range of the highlighted section is in an existing edit find it

    if(range.start !== range.end){ //If something was actually highlighted
      if(edit){ //If the selection includes an existing edit
        //edit that existing edit
        Session.set('selectedText',edit.edit) 
        Session.set('selectedTextRange',edit.location)
        $(messageEl).children("#"+edit._id).click();      
      }
      else{ //otherwise start a new edit
        Session.set('selectedText',selection.text);
        Session.set('selectedTextRange',range);      
      }
    }
    else{ //If it was just a click then deselect
      Session.set('selectedText',undefined);
      Session.set('selectedTextRange',undefined);        
    }
  }

  Session.set('clickedMessage',undefined) //cancel the mousedown event
},
});

Template.chatWindow.onRendered(function() {
  Session.set('tick',true); //Create 10 second clock for reactivity
  Meteor.setInterval(function() {
    Session.set('tick', !Session.get('tick'));
  }, 10000);
});