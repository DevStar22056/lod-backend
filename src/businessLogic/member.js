const _ = require('lodash');
const axios = require('axios');
const models = require('../database/models');

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripeApiVersion = process.env.STRIPE_API_VERSION;
const stripe = require('stripe')(stripeSecret);
var states = require('us-state-codes');

stripe.setApiVersion(stripeApiVersion);

module.exports = {
  // Attempt to find a member in GF that matches this stripe subscription
  createFromGFApi: async function(
    stripeSubscriptionId,
    stripeCustomerId,
  ) {
    let response = await axios.get(
      `https://www.lawyersofdistinction.com/wp-json/gf/v2/entries/?search={"field_filters": [{"key":"transaction_id","value":"${stripeSubscriptionId}","operator":"contains"}]}`,
      {
        auth: {
          username: process.env.GF_CONSUMER_KEY,
          password: process.env.GF_CONSUMER_SECRET,
        },
      },
    );

    if (response.data.total_count > 0) {
      let memberData = response.data.entries[0];

      let subscriptionUpgrade = _.get(memberData, '38'); //Upgrade To Featured or Distinguished Membership

      let subscriptionLevel = 'charter';
      switch (subscriptionUpgrade) {
        case '$100.00|100':
          subscriptionLevel = 'featured';
          break;
        case '$300.00|300':
          subscriptionLevel = 'distinguished';
          break;
      }

      let signupDate = new Date(
        _.get(memberData, 'date_created'),
      );
      let practiceArea = _.get(memberData, '48')
        ? _.get(memberData, '48')
        : _.get(memberData, '10');

      let addressState = module.exports.parseState(
        _.get(memberData, '3.4', ''),
      );

      let memberObject = {
        membershipYear: module.exports.membershipYearForSignupDate(
          signupDate,
        ),
        additionalCrystals:
          Number.parseInt(_.get(memberData, '46.3', 0)) ||
          0, //Add Additional Crystals (Quantity)
        additionalPlaques:
          Number.parseInt(_.get(memberData, '45.3', 0)) ||
          0, // Add Additional Plaques (Quantity)
        name:
          _.get(memberData, '8.3', '') +
          ' ' +
          _.get(memberData, '8.6', ''),
        firstName: _.get(memberData, '8.3', ''),
        lastName: _.get(memberData, '8.6', ''),
        location: addressState,
        practiceAddress1: _.get(memberData, '3.1', ''),
        practiceAddress2: _.get(memberData, '3.2'),
        practiceAddressCity: _.get(memberData, '3.3', ''),
        practiceAddressState: addressState,
        practiceAddressZip: _.get(memberData, '3.5', ''),
        profileDescription: _.get(
          memberData,
          'Description',
          '',
        ),
        profileEmail: _.get(memberData, '9', ''),
        profileFacebook: _.get(memberData, 'Facebook', ''),
        profileImage: _.get(memberData, 'Image', ''),
        profileSpecialization: practiceArea,
        profileTwitter: _.get(memberData, 'Twitter', ''),
        profileWebsite: _.get(memberData, '33', ''),
        shippingAddress1: _.get(memberData, '3.1', ''),
        shippingAddress2: _.get(memberData, '3.2'),
        shippingAddressCity: _.get(memberData, '3.3', ''),
        shippingAddressState: addressState,
        shippingAddressZip: _.get(memberData, '3.5', ''),
        stripeSubscriptionId: _.get(
          memberData,
          'transaction_id',
          '',
        ),
        stripeCustomerId: stripeCustomerId,
        subscriptionLevel: subscriptionLevel,
        status: 'pending',
      };

      let newMember = await models.member.create(
        memberObject,
      );

      await module.exports.updateStripeColumns(newMember);

      return newMember;
    }

    return null;
  },

  parseState: function(stateText) {
    let stateAbbreviation = states.sanitizeStateCode(
      stateText,
    );

    if (!stateAbbreviation) {
      let stateName = states.sanitizeStateName(stateText);
      stateAbbreviation = states.getStateCodeByStateName(
        stateName,
      );
    }

    return stateAbbreviation;
  },

  saveInvoice: async function(member, stripeInvoiceObject) {
    let lineItem = stripeInvoiceObject.lines.data[0];
    if (lineItem.type !== 'subscription') {
      console.log(
        'Payment was not for a subscription',
        stripeInvoiceObject.id,
      );
      return;
    }

    // ensure that it's only created once.
    let subscriptionPayment = await models.subscriptionPayment.create(
      {
        id: stripeInvoiceObject.id,
        stripeInvoice: JSON.stringify(stripeInvoiceObject),
      },
    );

    await member.addPayment(subscriptionPayment);

    return subscriptionPayment;
  },

  updateStripeColumns: async function(member) {
    if (!member.stripeSubscriptionId) {
      return;
    }

    let result = await stripe.subscriptions.retrieve(
      member.stripeSubscriptionId,
    );

    let renewalDate =
      result.status !== 'canceled' && !result.canceled_at
        ? new Date(result.current_period_end * 1000)
        : null;

    await member.update({
      subscriptionStatus: result.status,
      stripeSubscriptionStartedAt: new Date(
        result.created * 1000,
      ),
      subscriptionRenewsAt: renewalDate,
    });
  },

  membershipYearForSignupDate: function(membershipDate) {
    const signupYear = membershipDate.getFullYear();
    const cutoffDate = new Date(`11/8/${signupYear}`);
    const membershipYear =
      membershipDate < cutoffDate
        ? signupYear
        : signupYear + 1;

    return membershipYear;
  },

  //   createExternalProfile: async function(member) {
  //     if (member.slug || member.profileId) {
  //       throw new Error(
  //         `Member profile exists with id ${member.slug} and slug ${member.profileId}`,
  //       );
  //     }
  //     var WPAPI = require('wpapi');
  //     var wp = new WPAPI({
  //       endpoint: process.env.LOD_MEMBER_API_ENDPOINT,
  //     });

  //     wp.setHeaders(
  //       'Authorization',
  //       `Bearer ${process.env.LOD_MEMBER_API_TOKEN}`,
  //     );

  //     wp.lodProfile = wp.registerRoute('lod/v1', '/profile/');
  //     let profile = await wp.lodProfile().create({
  //       first_name: member.firstName,
  //       last_name: member.lastName,
  //       address: member.fullPracticeAddress(),
  //       location: member.practiceAddressState,
  //       mail: member.profileEmail,
  //       biography: member.profileDescription,
  //       facebook: member.profileFacebook,
  //       twitter: member.profileTwitter,
  //       website: member.profileWebsite,
  //       specialization: member.specialization,
  //       isFeatured: member.subscriptionLevel != 'charter',
  //       avvo_review: member.profileAvvoReview,
  //       avvo_rating: member.profileAvvoRating,
  //       google_review: member.profileGoogleReview,
  //       google_rating: member.profileGoogleRating,
  //     });

  //     await member.update({ profileLastSynced: new Date() });

  //     console.log(profile);
  //   },

  updateExternalProfile: async function(member) {
    if (member.isInternational) {
      return;
    }

    let WPAPI = require('wpapi');
    let wp = new WPAPI({
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
    let profile = await wp
      .lodProfile()
      .id(member.profileId)
      .update({
        first_name: member.firstName,
        last_name: member.lastName,
        address: member.fullPracticeAddress(),
        location: member.practiceAddressState,
        mail: member.profileEmail,
        biography: member.profileDescription,
        facebook: member.profileFacebook,
        twitter: member.profileTwitter,
        website: member.profileWebsite,
        specialization: member.specialization,
        isFeatured: member.subscriptionLevel != 'charter',
        avvo_review: member.profileAvvoReview,
        avvo_rating: member.profileAvvoRating,
        google_review: member.profileGoogleReview,
        google_rating: member.profileGoogleRating,
      });

    await member.update({ profileLastSynced: new Date() });
  },
};
