import { Conversations } from './conversations.js'

Meteor.users.deny({update: function () { return true; }});

if (Meteor.isServer) {
  // This code only runs on the server
  // publish matched users info

  Meteor.publish('matchedUsers', function editsPublication(users) {
    if (!this.userId) {
      return this.ready();
    }

    //Find this user
    const user = Meteor.users.findOne(this.userId,{matchedUsers:1})

    if(user.matched){
	    //Allow him to see some information about who he is matched with
	    return Meteor.users.find({ "_id" : { $in : user.matched.users }},
	    	{fields:{
	    		_id:1,
	    		username:1,
	    		'presence.status':1
	    	}});
	}
  });
} 