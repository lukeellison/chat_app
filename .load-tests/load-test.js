


meteorDown.init(function (Meteor) {
	Meteor.call('messages.send', 'PPHy9pHP9yhRkGv34', Meteor.userId() + ' - ' + new Date().toTimeString(), function (err, res) {
		if(err) console.log(err)
		Meteor.kill();
	});

});

meteorDown.run({
  concurrency: 10,
  url: "http://localhost:3000",
  key: 'SECRET_KEY',
  auth: {userIds: ['gP3F2NzCMxj6DHAc0', 'gP3F2NzCMxj6DHAc1']}
});





// {
// 	"_id" : "gP3F2NzCMxj6DHAc0",
// 	"createdAt" : ISODate("2016-06-13T00:39:15.987Z"),
// 	"services" : {
// 		"password" : {
// 			"bcrypt" : "$2a$10$apAcpWFM85SQyOCB9hNKruiGTkcWGmLKFWDs3yDSJ0BNpywPGJ9tm"
// 		},
// 		"resume" : {
// 			"loginTokens" : [ ]
// 		}
// 	},
// 	"username" : "test0",
// 	"emails" : [
// 		{
// 			"address" : undefined,
// 			"verified" : false
// 		}
// 	],
// 	"profile" : {
		
// 	},
// 	"matched" : {
// 		"users" : [],
// 		"convos" : []
// 	},
// 	"languages" : {
// 		"fluent" : [ ],
// 		"learning" : [ ]
// 	},
// 	"presence" : {
// 		"updatedAt" : ISODate("2016-06-14T03:05:41.926Z"),
// 		"serverId" : "4uWGfrhxdFhM5hDs8",
// 		"status" : "online"
// 	}
// }
