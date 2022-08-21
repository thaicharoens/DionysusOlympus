/**
 * tickets/claim
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
  fn: async function () {
    const { req, res } = this;
    const { id } = req.allParams();
    let ticket = await Ticket.findOne({ id: id });
    console.log('ticket', ticket);
    if (!ticket) {
      sails.log('Ticket not found');
      return res.status(400).json({
        status: false,
        message:'Ticket not found'
      });
    }

    if (ticket.cancelled) {
      return res.status(400).json({
        status: false,
        message:'Ticket cancelled'
      });
    }

    if (ticket.scanned || !ticket.transferable || !ticket.claimable) {
      sails.log('Ticket not transferable');
      return res.status(400).json({
        status: false,
        message:'Ticket not transferable'
      });
    }

    const receivingUser = await sails.helpers.aadB2CLookup.with({email:req.body.email});
    if (!receivingUser) {
      sails.log('User not found');
      return res.status(400).json({
        status: false,
        message:'User not found'
      });
    }

    await Transfer.create({ticket:id,from:ticket.uid,to:receivingUser});
    await Ticket.updateOne({ id: id }, { claimed: false, name: '', uid: receivingUser,barcode: sails.helpers.ticket.generateBarcode() });
    if (ticket.passkitPassId) {
      await sails.helpers.passkitCom.revoke.with({id:ticket.id});
    }
    return res.status(200).json({
      status: true,
      message:'Ticket transfered',
    });
  }
};
