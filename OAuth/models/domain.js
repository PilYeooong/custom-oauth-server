const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Domain extends Model {
  static init(sequelize) {
    return super.init({
      host: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('free', 'premium'),
        allowNull: false,
      },
      clientId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      clientSecret: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      redirectURI: {
        type: DataTypes.STRING(80),
        allowNull: false,
      }
    }, {
      sequelize,
      timestamps: true,
      paranoid: true,
      modelName: 'Domain',
      tableName: 'domains',
    })
  }

  static associate(db) {
    db.Domain.belongsTo(db.User);
  }
}