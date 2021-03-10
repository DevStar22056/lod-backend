// insert results of step 0 into the database

require('dotenv').config({ path: '../.env' });
const fs = require('fs');
const parser = require('csv-parse/lib/sync');
const csv = require('csvtojson');

const _ = require('lodash');
const models = require('../src/database/models');
models.sequelize.config.logging = false;
const memberBusinessLogic = require('../src/businessLogic/member');
var addressParser = require('parse-address');

let count = 0;

// console.log(
//   addressParser.parseLocation(
//     '800 Town and Country Blvd, Houston, TX 77024, USA',
//   ),
// );
// return;
async function main() {
  let profileRows = await csv().fromFile(
    './step0_result.csv',
  );

  //   profileRows = profileRows.slice(1, 11);

  for (const profileRow of profileRows) {
    try {
      let profileStatus;
      switch (profileRow.status) {
        case '0':
          profileStatus = 'canceled';
          break;
        case '1':
          profileStatus = 'active';
          break;
        default:
          console.log(
            `NO STATUS FOR ${profileRow.lawyer_id}`,
          );
      }

      let suscriptionLevel;
      switch (profileRow.plan) {
        case '1':
          suscriptionLevel = 'charter';
          break;
        case '2':
          suscriptionLevel = 'featured';
          break;
        case '3':
          suscriptionLevel = 'distinguished';
          break;
        default:
          console.log(`NO PLAN FOR ${profileRow.plan}`);
      }

      let practiceAddress = profileRow.address
        ? addressParser.parseLocation(profileRow.address)
        : {};

      let membershipYear = profileRow.stripeCustomerCreated
        ? memberBusinessLogic.membershipYearForSignupDate(
            new Date(profileRow.stripeCustomerCreated),
          )
        : null;

      await models.member.create({
        membershipYear: membershipYear,
        additionalCrystals: profileRow.additionalCrystals, //Add Additional Crystals (Quantity)
        additionalPlaques: profileRow.additionalPlaques, // Add Additional Plaques (Quantity)
        name: `${profileRow.first_name} ${profileRow.last_name}`,
        firstName: profileRow.first_name,
        lastName: profileRow.last_name,
        location: profileRow.location,
        practiceAddress1:
          [
            practiceAddress.number,
            practiceAddress.prefix,
            practiceAddress.street,
            practiceAddress.suffix,
            practiceAddress.type,
          ]
            .filter(Boolean)
            .join(' ') || null,
        practiceAddress2:
          [
            practiceAddress.sec_unit_type,
            practiceAddress.sec_unit_num,
          ]
            .filter(Boolean)
            .join(' ') || null,
        practiceAddressCity: practiceAddress.city,
        practiceAddressState: practiceAddress.state,
        practiceAddressZip: practiceAddress.zip,
        practiceAddressCountry: practiceAddress.country,
        profileDescription: profileRow.biography,
        profileEmail: profileRow.email.toLowerCase(),
        profileFacebook: profileRow.facebook,
        profileImage: profileRow.photo,
        profileSpecialization: profileRow.specialization,
        profileTwitter: profileRow.twitter,
        profileWebsite: profileRow.website,
        shippingAddress1: profileRow.shippingAddress1,
        shippingAddress2: profileRow.shippingAddress2,
        shippingAddressCity: profileRow.shippingAddressCity,
        shippingAddressState:
          profileRow.shippingAddressState,
        shippingAddressZip: profileRow.shippingAddressZip,
        stripeSubscriptionId:
          profileRow.stripeSubscriptionId,
        stripeCustomerId: profileRow.stripeCustomerId,
        subscriptionLevel: suscriptionLevel,
        status: profileStatus,
        profileId: profileRow.lawyer_id,
        slug: profileRow.slug,
        profileLastSynced: null,
      });
      if (count % 100 === 0) console.log(count++);
    } catch (error) {
      console.error(error);
      console.log(profileRow);
      process.exit();
    }
  }
  console.log('done');

  process.exit();
}

main();
