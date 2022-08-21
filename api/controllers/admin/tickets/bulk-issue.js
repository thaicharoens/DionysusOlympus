/**
 * admin/tickets/bulk-issue
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  fn: async function () {
    const { req, res } = this;
    const { ticketOrdersToIssue } = req.allParams();

    const issuedOrders = [];
    for (const ticketOrderToIssue of ticketOrdersToIssue) {
      if (ticketOrderToIssue.externalTransactionId) {
        sails.log(`External transaction ID, ${ticketOrderToIssue.externalTransactionId} of label: ${ticketOrderToIssue.externalTransactionIdLabel}, checking for duplicates`);
        const existingOrder = await Order.findOne({
          externalTransactionId: ticketOrderToIssue.externalTransactionId,
          externalTransactionIdLabel: ticketOrderToIssue.externalTransactionIdLabel
        });
        if (existingOrder) {
          sails.log('Duplicate order found, skipping');
          continue;
        } else {
          sails.log('No duplicate order found, issuing');
        }
      }

      sails.log(`Issuing ticket order of: ${ticketOrderToIssue.qty} for: ${ticketOrderToIssue.email} to event: ${ticketOrderToIssue.event}`);
      issuedOrders.push(await sails.helpers.ticket.issue.with({
        event:ticketOrderToIssue.event,
        qty:ticketOrderToIssue.qty,
        uid:'',
        email:ticketOrderToIssue.email,
        externalTransactionIdLabel: ticketOrderToIssue.externalTransactionIdLabel,
        externalTransactionId: ticketOrderToIssue.externalTransactionId
      }));
    }

    const issuedTicketsQty = issuedOrders.reduce((acc, order) => acc + order.qty, 0);

    return res.status(200).json({
      status: true,
      message:`${issuedOrders.length} orders/${issuedTicketsQty} tickets issued`,
      orders: issuedOrders
    });
  }
};
