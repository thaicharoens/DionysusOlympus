/**
 * tickets/mobile-wallet
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
  fn: async function () {
    const { req, res } = this;
    const { id } = req.allParams();
    const decodedJWT = await sails.helpers.aadB2C.with({ jwt: req.headers.authorization.split('Bearer ')[1] });
    let ticket = await Ticket.findOne({ id: id,uid: decodedJWT.sub });
    console.log('ticket', ticket);
    if (!ticket) {
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

    if (!ticket.claimed) {
      return res.status(400).json({
        status: false,
        message:'Ticket not claimed'
      });
    }

    if (ticket.scanned) {
      return res.status(400).json({
        status: false,
        message:'Ticket already scanned'
      });
    }

    let passkitPassId;
    if (ticket.passkitPassId) {
      sails.log('Ticket already exists as passkit.com pass ID', ticket.passkitPassId);
      passkitPassId = ticket.passkitPassId;
    } else {
      sails.log('Creating passkit.com pass');
      passkitPassId = await sails.helpers.passkitCom.issue.with({ id:ticket.id});
      if (passkitPassId) {
        ticket.passkitPassId = passkitPassId;
        await Ticket.updateOne({ id: id, }, { passkitPassId: passkitPassId });
      }
    }


    return res.status(200).json({
      status: true,
      message:'Google and apple wallet links provided',
      passkitPassId: passkitPassId,
      googleWalletLink: `https://pub1.pskt.io/${passkitPassId}.gpay`,
      appleWalletLink: `https://pub1.pskt.io/${passkitPassId}.pkpass`,
    });
  }
};
