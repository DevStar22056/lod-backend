const moment = require('moment');

module.exports = function(sequelize, DataTypes) {
  const subscriptionPayment = sequelize.define(
    'subscriptionPayment',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      stripeInvoice: {
        type: DataTypes.TEXT,
      },
      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
    },
  );

  subscriptionPayment.associate = (models) => {
    models.subscriptionPayment.belongsTo(models.member, {
      as: 'member',
      constraints: false,
    });



    models.subscriptionPayment.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.subscriptionPayment.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return subscriptionPayment;
};
