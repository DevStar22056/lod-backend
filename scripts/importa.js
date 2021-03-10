// insert results of step 0 into the database

require('dotenv').config({ path: '../.env' });
const fs = require('fs');
const parser = require('csv-parse/lib/sync');

const _ = require('lodash');
const models = require('../src/database/models');
models.sequelize.config.logging = false;
const memberBusinessLogic = require('../src/businessLogic/member');
var addressParser = require('parse-address');
var unmatchedMembers = require('./source/new-slugs-12-16.json');
let count = 0;

async function main() {
  var WPAPI = require('wpapi');
  var wp = new WPAPI({
    endpoint: process.env.LOD_MEMBER_API_ENDPOINT,
  });

  wp.setHeaders(
    'Authorization',
    `Bearer ${process.env.LOD_MEMBER_API_TOKEN}`,
  );

  wp.lodProfile = wp.registerRoute(
    'lod/v1',
    '/profile/(?P<id>)',
  );
  //   let profiles = await wp.lodProfile();
  console.log(unmatchedMembers.length);
  let completedCount = 0;
  for (let newMember of unmatchedMembers) {
    let profile = await wp.lodProfile().id(newMember.slug);

    try {
      let profileStatus;
      switch (profile.status) {
        case '0':
          profileStatus = 'canceled';
          break;
        case '1':
          profileStatus = 'active';
          break;
        default:
          console.log(`NO STATUS FOR ${profile.lawyer_id}`);
      }

      let suscriptionLevel;
      switch (profile.plan) {
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
          console.log(`NO PLAN FOR ${profile.plan}`);
      }

      let practiceAddress = profile.address
        ? addressParser.parseLocation(profile.address)
        : {};

      let membershipYear = profile.stripeCustomerCreated
        ? memberBusinessLogic.membershipYearForSignupDate(
            new Date(profile.stripeCustomerCreated),
          )
        : null;

      let datas = {
        membershipYear: membershipYear,
        additionalCrystals: profile.additionalCrystals, //Add Additional Crystals (Quantity)
        additionalPlaques: profile.additionalPlaques, // Add Additional Plaques (Quantity)
        name: `${profile.first_name} ${profile.last_name}`,
        firstName: profile.first_name,
        lastName: profile.last_name,
        location: profile.location,
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
        shippingAddress1:
          [
            practiceAddress.number,
            practiceAddress.prefix,
            practiceAddress.street,
            practiceAddress.suffix,
            practiceAddress.type,
          ]
            .filter(Boolean)
            .join(' ') || null,
        shippingAddress2:
          [
            practiceAddress.sec_unit_type,
            practiceAddress.sec_unit_num,
          ]
            .filter(Boolean)
            .join(' ') || null,
        shippingAddressCity: practiceAddress.city,
        shippingAddressState: practiceAddress.state,
        shippingAddressZip: practiceAddress.zip,
        shippingAddressCountry: practiceAddress.country,
        profileDescription: profile.biography,
        profileEmail: profile.mail
          ? profile.mail.toLowerCase()
          : null,
        profileFacebook: profile.facebook,
        profileImage: profile.photo,
        profileSpecialization: profile.specialization,
        profileTwitter: profile.twitter,
        profileWebsite: profile.website,
        stripeSubscriptionId:
          newMember.stripeSubscriptionId,
        stripeCustomerId: profile.stripeCustomerId,
        subscriptionLevel: suscriptionLevel,
        status: profileStatus,
        profileId: profile.lawyer_id,
        slug: profile.slug,
        profileLastSynced: null,
      };
      //   console.log(datas);
      let member = await models.member.create(datas);
      console.log(completedCount++, member.id);
    } catch (e) {
      count++;
      console.error(newMember, e);
    }
  }
  console.log(`done, ${count} errors`);

  process.exit();
}

main();
