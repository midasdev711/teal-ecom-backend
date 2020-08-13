const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { get } from 'lodash';
import User from '../models/User';
import mongoose, { Schema } from 'mongoose';
import Subscription from '../models/Subscription';
import StripeCustomer from '../models/StripeCustomer';
import { isEmpty } from 'underscore';
import HttpStatus from 'http-status-codes';

module.exports = function (app) {
  // Webhook handler for stripe events
  app.post("/webhooks/stripe", async (req, res) => {
    console.log(`Stripe Webhook request received. Event: ${eventType}`);

    let data;
    let eventType;
    // Check if webhook signing is configured.
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event;
      let signature = req.headers["stripe-signature"];

      try {
        event = stripe.webhooks.constructEvent(
          req.rawBody,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`);
        return res.sendStatus(400);
      }
      // Extract the object from the event.
      data = event.data;
      eventType = event.type;
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // retrieve the event data directly from the request body.
      data = req.body.data;
      eventType = req.body.type;
    }


    // Customer completed checkout
    if (eventType === "checkout.session.completed") {

      let internalUser;
      let internalStripeCustomer;
      let externalCustomer;
      let externalStripeSubscription;
      let externalSubscriptionId = data.object.subscription;

      try {
        externalCustomer = await stripe.customers.retrieve(data.object.customer);
      }
      catch (e) {
        const errMsg = `💰⚠❓ No customer found! in checkout.session.completed. customer: ${data.object.customer}`;
        console.log(e);

        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ errMsg });
      }

      try {
        externalStripeSubscription = await stripe.subscriptions.retrieve(externalSubscriptionId);
      }
      catch (e) {
        const errMsg = `💰⚠❓ No subscription found! in checkout.session.completed. subscriptionId: ${externalSubscriptionId}`;
        console.log(e);

        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ errMsg });
      }



      // Technically, this should always ever be called once since this comes through
      // a webhook, however we certainly want to avoid creating two subscriptions for the same
      // stripe subscription ID.
      const existingSubscription = await Subscription.findOne({ externalId: externalSubscriptionId });
      internalUser = await User.findOne({ _id: data.object.client_reference_id });

      if (existingSubscription) {
        existingSubscription.activate();
        console.log(`💰✅ Existing subscription activated, ID: ${externalSubscriptionId}`);
      }
      else {
        const newSubscription = new Subscription({
          externalId: externalSubscriptionId,
          externalCustomerId: externalCustomer.id,
          type: 'PLUS',
          email: internalUser.email,
          userId: internalUser.id,
          metadata: externalStripeSubscription,
        });

        newSubscription.save();

        console.log(`💰✅ Subscription created for ${internalUser.id}, ${internalUser.email}, ${externalSubscriptionId}`);
      }

      return res.status(HttpStatus.CREATED).send({});
    }

    // Default unhandled webhook
    return res.sendStatus(HttpStatus.OK);
  });  
}
