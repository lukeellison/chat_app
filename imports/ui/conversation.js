import './conversation.html'

Template.conversation.helpers({
convoName(name, users) {
  //return string for conversation name
  if(name == ""){ //If no name
    users.splice(users.indexOf(Meteor.user().username), 1); //Remove user from array

    var newName = users[0]; //Set it to the only name initially
    if (users[0].length > 1 && typeof users[0] !== 'string'){ //If there are more members then add them to the convo name
    	newName = users[0][0]; //First set it to first other memeber of group
	  	for (var i = 1; i < users[0].length ; i++) {
        newName += ', ' + users[0][i]
	  	};
    }
  	return newName
  }
  else return name; //Otherwise just return the chosen name
}
});