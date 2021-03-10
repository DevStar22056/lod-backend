// Match database entries to airtable entries to add additional plaqeues/crystals & shippng addresses

require('dotenv').config({ path: '../.env' });

const models = require('../src/database/models');
models.sequelize.config.logging = false;
const stripe = require('stripe')(
  process.env.STRIPE_SECRET_KEY,
);

let count = 0;

async function main() {
  for await (const subscription of stripe.subscriptions.list(
    { limit: 100 },
  )) {
    let members = await models.member.findAll({
      where: {
        stripeSubscriptionId: subscription.id,
      },
    });

    if (members.length == 0) {
      console.log(subscription.status, subscription.id);
    }
  }

  //   let members = await models.member.findAll({
  //     where: {
  //       [Op.and]: [
  //         {
  //           stripeSubscriptionId: {
  //             [Op.ne]: '',
  //           },
  //         },
  //         {
  //           stripeSubscriptionStartedAt: {
  //             [Op.eq]: null,
  //           },
  //         },
  //       ],
  //     },
  //   });
  //   console.log(members.length);

  //   for (const member of members) {
  //     await update(member);
  //     console.log(member.id, count++);
  //   }

  console.log(`done. ${count} not matched `);

  process.exit();
}

main();

async function update(member) {
  let stripeSubscriptionId = member.stripeSubscriptionId;

  try {
    let result = await stripe.subscriptions.retrieve(
      stripeSubscriptionId,
    );

    await member.update({
      stripeSubscriptionStartedAt: new Date(
        result.created * 1000,
      ),
    });
  } catch (e) {
    console.log(stripeSubscriptionId, e.message);
  }
}
