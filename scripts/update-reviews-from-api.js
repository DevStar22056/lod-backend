require('dotenv').config({ path: '../.env' });
const _ = require('lodash');
const models = require('../src/database/models');

async function main() {
  var WPAPI = require('wpapi');
  var wp = new WPAPI({
    endpoint: process.env.LOD_MEMBER_API_ENDPOINT,
  });

  wp.setHeaders(
    'Authorization',
    `Bearer ${process.env.LOD_MEMBER_API_TOKEN}`,
  );

  wp.lodProfile = wp.registerRoute('lod/v1', '/profile/');

  let profiles = await wp.lodProfile();
  console.log(profiles.length);

  for (let profile of profiles) {
    let member = await models.member.findOne({
      where: {
        slug: profile.slug,
      },
    });

    if (member) {
      await member.update({
        profileAvvoReview: profile.avvo_review,
        profileAvvoRating: profile.avvo_rating,
        profileGoogleReview: profile.google_review,
        profileGoogleRating: profile.google_rating,
      });
    } else {
      console.log(profile.slug);
    }
  }
  console.log('done');
  process.exit();
}

main();
