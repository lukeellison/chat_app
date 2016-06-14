


meteorDown.init(function (Meteor) {
	Meteor.call('messages.send', 'KrwYTDKpY5Kb73ZQx', Meteor.userId() + ' - ' + new Date().toTimeString(), function (err, res) {
		if(err) console.log(err)
		Meteor.kill();
	});

});

meteorDown.run({
  concurrency: 40,
  url: "https://boiling-atoll-86431.herokuapp.com",
  key: 'SECRET_KEY',
  auth: {userIds: ['gP3F2NzCMxj6DHAc0', 'gP3F2NzCMxj6DHAc1']}//, 'gP3F2NzCMxj6DHAc2']}//, 'gP3F2NzCMxj6DHAc3']}//, 'gP3F2NzCMxj6DHAc4']}
});