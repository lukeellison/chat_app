import { Router } from 'meteor/iron:router'

Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/',function(){
	this.render('landing')
});

Router.route('/home',function(){
	this.render('landing')
});

Router.route('/dashboard',
	function(){
		if(Meteor.user)
			this.render('chat')
		else
			router.go('/sign-in')
    },
);

Router.route('/register',function(){
	this.render('register')
});