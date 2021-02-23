export default function (sequelize, DataTypes) {

    const retailercardnumbers = sequelize.define('retailercardnumbers', {

        rcnid : {
                type: DataTypes.BIGINT, allowNull: false, primaryKey: true, autoIncrement: true
        },

        retailerid: {
                type: DataTypes.INTEGER
        },

        status: {
                type: DataTypes.TEXT
        },

        receivedate: {
                type: DataTypes.BIGINT
        },

        giftcardnumber: {
                type: DataTypes.TEXT
        },

        serialnumber: {
                type: DataTypes.TEXT
        },

        amount: {
                type: DataTypes.REAL
        },

        expirationdate: {
                type: DataTypes.BIGINT
        },

        carddetid: {
                type: DataTypes.BIGINT
        },

        cleansedgcnumber: {
                type: DataTypes.TEXT
        }

        },{
        tableName: 'retailercardnumbers', 
        freezeTableName: true,
        timestamps: false
    });

    retailercardnumbers.associate = (models) => {
        retailercardnumbers.belongsTo(models.carddet, { foreignKey: 'carddetid'});
        retailercardnumbers.belongsTo(models.retailer, { foreignKey: 'retailerid'});
    }
    return retailercardnumbers;
}