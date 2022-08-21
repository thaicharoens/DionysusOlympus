const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {


  friendlyName: 'Email.Send',


  description: 'Send email using the selected template and data.',


  inputs: {
    template: {
      description: 'The ID of the template to use.',
      type: 'string',
    },
    to: {
      description: 'The email address to send the email to.',
      type: 'string',
    },
    data: {
      description: 'The data to use when rendering the template.',
      type: 'ref',
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    sails.log(inputs);
    const msg = {
      to: inputs.to,
      from: 'noreply@dionysusticketing.app',
      templateId: inputs.template,
      dynamicTemplateData: inputs.data,
    };
    return sgMail.send(msg);
  }


};

