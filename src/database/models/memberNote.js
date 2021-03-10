const moment = require('moment');
const _ = require('lodash');

module.exports = function(sequelize, DataTypes) {
  const memberNote = sequelize.define(
    'memberNote',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      note: {
        type: DataTypes.TEXT,
      },
    },
  );

  memberNote.associate = (models) => {
    models.memberNote.belongsTo(models.member, {
      as: 'member',
    });

    models.memberNote.belongsTo(models.user, {
      as: 'createdBy',
    });

    models.memberNote.belongsTo(models.user, {
      as: 'updatedBy',
    });
  };

  return memberNote;
};
