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

    if (!ticket.claimable) {
      return res.status(400).json({
        status: false,
        message:'Ticket not claimable'
      });
    }

    //I an atheist pray for whoever needs to maintain this regex
    //I am not a regex expert
    const regex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+ [a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/;
    if (!regex.test(req.body.name)) {
      return res.status(400).json({
        status: false,
        message:'Please enter the full name of the person claiming the ticket'
      });
    }

    await Ticket.updateOne({ id: id,uid: decodedJWT.sub }, { claimed: true, name: req.body.name, barcode: sails.helpers.ticket.generateBarcode() });
    ticket = await Ticket.findOne({ id: id,uid: decodedJWT.sub });

    sails.log('Creating passkit.com pass');
    passkitPassId = await sails.helpers.passkitCom.issue.with({ id:ticket.id});
    if (passkitPassId) {
      ticket.passkitPassId = passkitPassId;
      await Ticket.updateOne({ id: id, }, { passkitPassId: passkitPassId });
    }

    return res.status(200).json({
      status: true,
      message:'Ticket claimed',
      ticket: ticket
    });
  }
};
