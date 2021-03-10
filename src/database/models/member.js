const moment = require('moment');
const _ = require('lodash');

module.exports = function(sequelize, DataTypes) {
  const member = sequelize.define(
    'member',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: [2, 255],
          notEmpty: true,
        },
      },
      firstName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: [2, 255],
          notEmpty: true,
        },
      },
      lastName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: [2, 255],
          notEmpty: true,
        },
      },
      location: {
        description: 'Grouping within the directory',
        type: DataTypes.STRING,
        allowNull: true,
        validate: {},
      },
      membershipYear: {
        description: 'First year they were a member',
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 2015,
          max: 2030,
        },
      },
      status: {
        description: 'Status of their membership pofile',
        type: DataTypes.ENUM,
        allowNull: false,
        values: [
          'pending',
          'active',
          'suspended',
          'canceled',
          'denied',
        ],
      },
      subscriptionStatus: {
        type: DataTypes.ENUM,
        allowNull: true,
        values: [
          'trialing',
          'active',
          'past_due',
          'unpaid',
          'canceled',
        ],
      },
      subscriptionLevel: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['charter', 'featured', 'distinguished'],
      },
      additionalCrystals: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      additionalPlaques: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      stripeSubscriptionId: {
        type: DataTypes.TEXT,
      },
      stripeCustomerId: {
        type: DataTypes.TEXT,
      },
      practiceAddress1: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
      practiceAddress2: {
        type: DataTypes.TEXT,
      },
      practiceAddressCity: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          //   notEmpty: true,
        },
      },
      practiceAddressState: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {},
      },
      practiceAddressZip: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {},
      },
      practiceAddressCountry: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {},
      },
      shippingAddress1: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
      shippingAddress2: {
        type: DataTypes.TEXT,
      },
      shippingAddressCity: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          //   notEmpty: true,
        },
      },
      shippingAddressState: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {},
      },
      shippingAddressZip: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {},
      },
      shippingAddressCountry: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {},
      },
      isInternational: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      profileId: {
        description:
          'lawyer_id within WordPress for the  profile',
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      slug: {
        description: 'slug for WordPress profile url',
        type: DataTypes.TEXT,
        allowNull: true,
      },
      profileDescription: {
        type: DataTypes.TEXT,
      },
      profileEmail: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      profileFacebook: {
        type: DataTypes.TEXT,
      },
      profileTwitter: {
        type: DataTypes.TEXT,
      },
      profileWebsite: {
        type: DataTypes.TEXT,
      },
      profileSpecialization: {
        type: DataTypes.TEXT,
      },
      profileLastSynced: {
        description: 'timestamp of last profile push to WP',
        type: DataTypes.DATE,
      },
      stripeSubscriptionStartedAt: {
        description: 'subscription start timestamp',
        type: DataTypes.DATE,
      },
      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
      profileAvvoReview: {
        type: DataTypes.TEXT,
      },
      profileAvvoRating: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      profileGoogleReview: {
        type: DataTypes.TEXT,
      },
      profileGoogleRating: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      subscriptionRenewsAt: {
        description: 'timestamp of subscription renews',
        type: DataTypes.DATE,
      },
      activedAt: {
        description: 'actived timestamp',
        type: DataTypes.DATE,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      hooks: {
        async afterUpdate(member, options) {
          if (
            member.status === 'active' &&
            member.previous('status') === 'pending'
          ) {
            // this user just went active. create the initial shipment.
            let subscriptionPayments = await member.getPayments();
            let firstPayment = subscriptionPayments[0];

            const shipmentBusinessLogic = require('../../businessLogic/shipments.js');

            await shipmentBusinessLogic.generateMemberShipment(
              member,
              firstPayment,
              true,
            );
          }

          // if these keys change, we will update the profile.
          let updateKeys = [
            'name',
            'mname',
            'practiceAddress1',
            'practiceAddress2',
            'practiceAddressCity',
            'practiceAddressState',
            'practiceAddressZip',
            'practiceAddressCountry',
            'location',
            'profileEmail',
            'profileDescription',
            'profileFacebook',
            'profileTwitter',
            'profileWebsite',
            'specialization',
            'subscriptionLevel',
            'profileAvvoReview',
            'profileAvvoRating',
            'profileGoogleReview',
            'profileGoogleRating',
          ];
          if (
            !member.isInternational &&
            member.profileId &&
            _.intersection(member.changed(), updateKeys)
              .length > 0
          ) {
            const memberBusinessLogic = require('../../businessLogic/member');
            let response = memberBusinessLogic.updateExternalProfile(
              member,
            );
          }
        },
      },
    },
  );

  member.associate = (models) => {
    models.member.hasMany(models.shipment, {
      as: 'shipments',
      constraints: false,
      foreignKey: 'memberId',
    });

    models.member.hasMany(models.subscriptionPayment, {
      as: 'payments',
      constraints: false,
      foreignKey: 'memberId',
    });

    models.member.hasMany(models.file, {
      as: 'profileImage',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: models.member.getTableName(),
        belongsToColumn: 'profileImage',
      },
    });

    models.member.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.member.belongsTo(models.user, {
      as: 'updatedBy',
    });

    models.member.belongsTo(models.user, {
      as: 'activedBy',
    });
  };

  member.prototype.fullPracticeAddress = function() {
    let address = this.practiceAddress1;

    if (this.practiceAddress2) {
      address = `${address}, ${member.practiceAddress2}`;
    }

    address = `${address}, ${member.practiceAddressCity}, ${member.practiceAddressState} ${member.practiceAddressZip}`;
    return address;
  };

  member.beforeUpdate((member, options) => {
    if (
      member.status === 'active' &&
      member.previous('status') === 'pending'
    ) {
      member.activedAt = member.updatedAt;
      member.activedById = member.updatedById;
    }
  });

  return member;
};
