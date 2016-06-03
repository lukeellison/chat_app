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
		this.render('chat')
    },
    {
		onBeforeAction: function () {
			AccountsEntry.signInRequired(this);
		}    	
    }
);

Router.route('/register',function(){
	this.render('register')
});