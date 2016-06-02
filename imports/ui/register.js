// import 'meteor/anback:bootstrap-validator'
import './register.html'
import './languageSelect.html'

Template.register.onRendered(function(){
    $('form').validator().on('submit', function (event) {
        if (event.isDefaultPrevented()) {
            console.log("form not valid")
        } else {
            console.log("okay")
        }
    })
})

Template.register.helpers({

})

Template.register.events({
'submit form'(event){
    event.preventDefault();
    console.log(event)
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const Nlanguage = $("select#Nlanguage :selected").attr("value")
    const Flanguages = $("select#Flanguage :selected").map(function(){
    	return $(this).attr("value")
    }).get()
    const Llanguages = $("select#Llanguage :selected").map(function(){
    	return $(this).attr("value")
    }).get()



    console.log(Nlanguage)
    // Meteor.loginWithPassword(emailVar, passwordVar);
},
'click .add'(event){
	event.preventDefault();
	const parent = $(event.target).closest("div")[0]
	const id = parent.id
	Blaze.renderWithData(Template.languageSelect,{"id":id},parent,event.target)
}
});