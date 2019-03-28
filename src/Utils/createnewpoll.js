var Poll = require('../.././model/poll');
var ObjectId = require('mongodb').ObjectID;
var appendPollToUser = require('./appendpolltouser')

module.exports = {
  createNewPoll: async function(admin_id, options, poll_items, title, members)
  {
    var new_poll = new Poll()
    new_poll.admin_id = admin_id
    new_poll.options = options
    new_poll.poll_id = new ObjectId()
    new_poll.poll_items = poll_items
    new_poll.status = true
    new_poll.threshold = 0.5
    new_poll.title = title
    new_poll.members = members

    new_poll.save(function(err)
    {
      if (err)
      {
        return {allow: false, message: "Unable to create poll"}
      }
    })

    console.log(members)
    for (var i=0; i<members.length; i++)
    {
      try
      {
        console.log("Adding poll "+new_poll.poll_id+ " to user profile "+members[i])
        let appendPoll = await appendPollToUser.appendPollToUser(new_poll.poll_id, members[i])
        console.log(appendPoll)
      }
      catch(error)
      {
        console.log(error)
        return(error)
      }
    }

    console.log("Done with new poll creation...")
    return {allow: true, poll_id: new_poll.poll_id}
  }
}
