import './message.html'

Template.message.helpers({
time: function (id) {
  //return readable string from the sentAt
  var sentAt = Messages.findOne({_id : id}).sentAt;
  return sentAt.toDateString();
}
});