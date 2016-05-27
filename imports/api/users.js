import { Conversations } from './conversations.js'

Meteor.users.deny({update: function () { return true; }});

if (Meteor.isServer) {
  // This code only runs on the server
  // publish matched users info

  Meteor.publish('matchedUsers', function editsPublication() {
    if (!this.userId) {
      return this.ready();
    }

    //Find this user
    const user = Meteor.users.findOne(this.userId,{
      _id:1,
      username:1,
      'presence.status':1,
      'matched':1
    })

    if(user.matched){
	    //Allow him to see some information about who he is matched with
	    return Meteor.users.find({$or:[this.userId,{ "_id" : { $in : user.matched.users }}]},
	    	{fields:{
	    		_id:1,
	    		username:1,
	    		'presence.status':1,
          'matched':1
	    	}});
    }else return user
  });
} 