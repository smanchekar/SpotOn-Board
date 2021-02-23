export default function(sequelize, DataTypes) {
    const retailer = sequelize.define(
        'retailer',
        {
            retailerid: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            retailername: {
                type: DataTypes.TEXT
            },
            retaileractive: {
                type: DataTypes.INTEGER
            },
            groupid: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            merchantid: {
                type: DataTypes.TEXT
            }
        },
        {
            tableName: 'retailer',
            freezeTableName: true,
            timestamps: false
        }
    );

    retailer.associate = models => {
        retailer.hasMany(models.retailerprofile, { foreignKey: 'retailerid' });
        retailer.belongsToMany(models.category, {
            through: 'retailercategorymap',
            as: 'retailercategory',
            foreignKey: 'retailerid',
            otherKey: 'catid'
        });
        retailer.belongsTo(models.retailercardnumbers, { foreignKey: 'retailerid' });
        retailer.belongsTo(models.carddet, { foreignKey: 'retailerid' });
    };
    return retailer;
}
