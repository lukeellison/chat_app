import { Router } from 'meteor/iron:router'

Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/',function(){
	this.render('landing')
});

Router.route('/chat',function(){
	this.render('chat')
});

Router.route('/register',function(){
	this.render('register')
});