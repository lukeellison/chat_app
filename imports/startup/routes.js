import { Router } from 'meteor/iron:router'

Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/',function(){
	this.render('chat')
});