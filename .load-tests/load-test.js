


meteorDown.init(function (Meteor) {
	Meteor.call('messages.send', 'KrwYTDKpY5Kb73ZQx', Meteor.userId() + ' - ' + new Date().toTimeString(), function (err, res) {
		if(err) console.log(err)
		Meteor.kill();
	});

});

meteorDown.run({
  concurrency: 10,
  url: "https://boiling-atoll-86431.herokuapp.com",
  key: 'SECRET_KEY',
  auth: {userIds: ['gP3F2NzCMxj6DHAc0', 'gP3F2NzCMxj6DHAc1']}//, 'gP3F2NzCMxj6DHAc2', 'gP3F2NzCMxj6DHAc3', 'gP3F2NzCMxj6DHAc4']}
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
