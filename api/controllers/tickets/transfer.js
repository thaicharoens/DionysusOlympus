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
    const decodedJWT = await sails.helpers.aadB2C.with({ jwt: req.headers.authorization.split('Bearer ')[1] });
    let ticket = await Ticket.findOne({ id: id,uid: decodedJWT.sub }).populate('event');
    console.log('ticket', ticket);
    if (!ticket) {
      return res.status(400).json({
        status: false,
        message:'Ticket not found'
      });
    }

    if (ticket.scanned || !ticket.transferable || !ticket.claimable) {
      return res.status(400).json({
        status: false,
        message:'Ticket not transferable'
      });
    }

    if (ticket.cancelled) {
      return res.status(400).json({
        status: false,
        message:'Ticket cancelled'
      });
    }

    const receivingUser = await sails.helpers.aadB2CLookup.with({email:req.body.email});
    if (!receivingUser) {
      return res.status(400).json({
        status: false,
        message:'User not found'
      });
    }

    await Transfer.create({ticket:id,from:ticket.uid,to:receivingUser});
    await Ticket.updateOne({ id: id,uid: decodedJWT.sub }, { claimed: false, name: '', uid: receivingUser, barcode: sails.helpers.ticket.generateBarcode()});
    if (ticket.passkitPassId) {
      sails.log('Deleting passkit pass');
      await sails.helpers.passkitCom.revoke.with({id:ticket.id});
    }


    sails.log('We have the UID of the user');
    await sails.helpers.email.send.with({
      template:'d-b3f14a83b5444396973b287d6a91ff89',
      to:req.body.email,
      data: {
        event: ticket.event,
      }
    });


    return res.status(200).json({
      status: true,
      message:'Ticket transfered',
    });
  }
};
