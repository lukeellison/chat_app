import { Router } from 'meteor/iron:router'

Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/',function(){
	if(Meteor.user())
		Router.go('/dashboard')
	else
		this.render('landing')
});

Router.route('/home',function(){
	if(Meteor.user())
		Router.go('/dashboard')
	else
		this.render('landing')
});

Router.route('/dashboard',
	function(){
		if(Meteor.user())
			this.render('chat')
		else
			Router.go('/sign-in')
    },
);

// Router.route('/register',function(){
// 	this.render('register')
// });