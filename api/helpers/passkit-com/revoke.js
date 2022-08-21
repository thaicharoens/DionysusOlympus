module.exports = {


  friendlyName: 'Passkit-com.revoke',


  description: 'Revokes a passkit.com pass by passkit.com ID',


  inputs: {
    id: {
      type: 'string',
      required: true
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    const ticket = await Ticket.findOne({ id: inputs.id });

    const jwt = sails.helpers.passkitCom.jwt();
    const revokedPass = await fetch('https://api.pub1.passkit.io/eventTickets/ticket', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${jwt}`,
      },
      body: JSON.stringify({
        ticketId: ticket.passkitPassId,
        //ticketId: inputs.id
      })
    }).then(res => res.json());
    sails.log(revokedPass);
    await Ticket.update({ id: ticket.id }, { passkitPassId:'' });
    return true;
  }


};

