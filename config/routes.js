/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },
  'POST /cart': { action: 'cart/new' },
  'GET /cart/:key': { action: 'cart/cart' },
  'GET /cart/:key/order': { action: 'cart/order' },

  'GET /order/:key': { action: 'order/order' },
  'GET /order/:key/tickets': { action: 'order/tickets' },
  'POST /cart/:key/pay': { action: 'cart/pay' },
  'POST /stripe/webhook': { action: 'stripe/webhook' },
  'GET /tickets': { action: 'tickets/tickets' },
  'POST /tickets/:id/claim': { action: 'tickets/claim' },
  'POST /tickets/:id/transfer': { action: 'tickets/transfer' },
  'GET /tickets/:id/mobileWallet': { action: 'tickets/mobile-wallet' },

  'GET /validate/events': { action: 'validate/events' },
  'POST /validate/device-registration': { action: 'validate/device-registration' },
  'POST /validate/validate': { action: 'validate/validate' },

  'GET /admin/tickets': { action: 'admin/tickets/tickets' },
  'GET /admin/tickets/:id/': { action: 'admin/tickets/ticket' },
  'POST /admin/tickets/:id/transfer': { action: 'admin/tickets/transfer' },
  'GET /admin/uid-to-email': { action: 'admin/uid-to-email' },
  'POST /admin/events/:eventId/set-total-qty': { action: 'admin/events/set-total-qty' },
  'POST /admin/tickets/bulk-issue': { action: 'admin/tickets/bulk-issue' },
  'POST /admin/roles': { action: 'admin/roles/set' },

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
