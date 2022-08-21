/**
 * admin/roles/set
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
  fn: async function () {
    const { req, res } = this;
    const { event,role,email } = req.allParams();

    const receivingUser = await sails.helpers.aadB2CLookup.with({email:email});
    if (!receivingUser) {
      sails.log('User not found');
      return res.status(400).json({
        status: false,
        message:'User not found'
      });
    }
    let assignedEvent = await Event.findOne({ id: event });
    console.log('assignedEvent', assignedEvent);
    if (!assignedEvent) {
      return res.status(400).json({
        status: false,
        message:'Event not found'
      });
    }

    await Agent.create({event:event, role:role, user:receivingUser});
    return res.status(200).json({
      status: true,
      message:'User assigned role for event',
    });
  }
};
