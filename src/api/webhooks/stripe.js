const express = require('express');
const router = express.Router();
const models = require('../../database/models');
const MemberBusinessLogic = require('../../businessLogic/member');
const ShipmentBusinessLogic = require('../../businessLogic/shipments');

const ErrorEmail = require('../../emails/errorEmail');
const EmailSender = require('../../services/shared/email/emailSender');

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripeApiVersion = process.env.STRIPE_API_VERSION;
const stripe = require('stripe')(stripeSecret);
stripe.setApiVersion(stripeApiVersion);

function addStripeEvent(req, res, next) {
  try {
    req.stripeEvent = stripe.webhooks.constructEvent(
      req.rawBody,
      req.headers['stripe-signature'],
      webhookSecret,
    );
  } catch (e) {
    // If `constructEvent` throws an error, respond with the message and return.
    console.log('Error', e.message);
    return res
      .status(400)
      .send('Stripe Webhook Error:' + e.message);
  }

  return next();
}

async function subscriptionIsNew(subscriptionId) {
  let subscription = await stripe.subscriptions.retrieve(
    subscriptionId,
  );

  return (
    subscription.current_period_start ===
    subscription.created
  );
}

const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.post(
  `/stripe`,
  /*addStripeEvent,*/ async (req, res) => {
    let event = req.body;
    try {
      console.log(`Stripe webhook: ${event.type}`);

      switch (event.type) {
        case 'invoice.payment_succeeded':
          var stripeInvoiceObject = event.data.object;
          var customerId = stripeInvoiceObject.customer;
          var subscriptionId =
            stripeInvoiceObject.subscription;

          var member = await models.member.findOne({
            where: {
              stripeCustomerId: customerId,
            },
          });

          let isNewSubscription = await subscriptionIsNew(
            subscriptionId,
          );

          if (!member) {
            if (isNewSubscription) {
              console.log(
                `Member not already known for stripe customer ${customerId} - attempting to import from GF`,
              );

              // find and create the member from the gravity forms api
              member = await MemberBusinessLogic.createFromGFApi(
                subscriptionId,
                customerId,
              );

              if (!member) {
                console.error(
                  `Stripe reported a subscription ${subscriptionId} payment, but could not match to GF entry. `,
                );
                await sendErrorEmail(
                  `Customer not matched to GF entry - event ${event.id}`,
                );
                return res.status(404).send({
                  error: 'Customer not matched to GF entry',
                });
              }
            } else {
              await sendErrorEmail(
                `Subscription not matched to any existing member - event ${event.id}`,
              );
              return res.status(404).send({
                error:
                  'Subscription not matched to any existing member',
              });
            }
          }

          let invoice = await MemberBusinessLogic.saveInvoice(
            member,
            stripeInvoiceObject,
          );

          // updates stripeSubscriptionStartedAt and subscriptionRenewsAt
          await MemberBusinessLogic.updateStripeColumns(
            member,
          );

          let sendWelcomePack = isNewSubscription;

          let shipment = await ShipmentBusinessLogic.generateMemberShipment(
            member,
            invoice,
            sendWelcomePack,
          );

          break;
        case 'customer.subscription.updated':
          var stripeSubscriptionObject = event.data.object;
          var subscriptionId = stripeSubscriptionObject.id;

          var member = await models.member.findOne({
            where: {
              stripeSubscriptionId: subscriptionId,
            },
          });

          if (member) {
            await MemberBusinessLogic.updateStripeColumns(
              member,
            );
          }

          break;
        default:
          console.info(
            `Stripe event type ${event.type} is not handled.`,
          );
      }

      return res.status(200).send({ processed: true });
    } catch (e) {
      console.error(e);

      return res.status(500).end();
    }
  },
);

function sendErrorEmail(message) {
  const errorEmail = new ErrorEmail(
    'en',
    'luke@lukechambers.com',
    message,
  );

  return new EmailSender(errorEmail).send();
}

module.exports = router;
