import { Meteor } from 'meteor/meteor';

import '../imports/startup/accounts-config.js';

import '../imports/api/messages.js'; //Load Messages database collection and methods
import '../imports/api/conversations.js'
import '../imports/api/edits.js'
import '../imports/api/users.js'

Meteor.startup(() => {
//	code to run on server at startup
//	process.env.MAIL_URL = 'smtp://USERNAME:PASSWORD@HOST:PORT/'
//	process.env.MAIL_URL = 'smtp://postmaster@sandboxa58fe9d2318b4385853593c6f482866e.mailgun.org:7f2787f70d8daa67f91e776a2f498f04@smtp.mailgun.org:587/'
});
