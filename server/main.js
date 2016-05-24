import { Meteor } from 'meteor/meteor';

import '../imports/api/messages.js'; //Load Messages database collection and methods
import '../imports/api/conversations.js'
import '../imports/api/edits.js'
import '../imports/api/users.js'

Meteor.startup(() => {
  // code to run on server at startup
});
