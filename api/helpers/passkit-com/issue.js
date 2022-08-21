module.exports = {


  friendlyName: 'Passkit com issue',


  description: '',


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
    if (!ticket) {
      throw new Error('TICKET_NOT_FOUND');
    }
    const jwt = sails.helpers.passkitCom.jwt();
    const issuedPass = await fetch('https://api.pub1.passkit.io/eventTickets/ticket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${jwt}`,
      },
      body: JSON.stringify({
        eventId: '2FllBpmMlCnvcoq2FSHNjI',
        ticketTypeId: '7sR7yXTq9ms2oxLyOiz1vn',
        barcodeContents: ticket.barcode,
        ticketNumber: ticket.barcode,
        person: {
          forename: ticket.name,
          displayName: ticket.name,
        },
        metaData: {
          ticketHolder: ticket.name
        }
      })
    }).then(res => res.json());

    sails.log(issuedPass);
    if (issuedPass.id) {
      return issuedPass.id;
    } else {
      throw new Error('Error issuing passkit.io pass');
    }
  }


};

