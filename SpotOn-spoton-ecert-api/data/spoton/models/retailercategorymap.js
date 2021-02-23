export default function (sequelize, DataTypes) {

    const retailercategorymap = sequelize.define('retailercategorymap', {
	
		catid : {
			type: DataTypes.INTEGER, allowNull: false, primaryKey: true
		},
		
		retailerid : {
			type: DataTypes.INTEGER, allowNull: false, primaryKey: true
		}
	}, {
		tableName: 'retailercategorymap', 
		freezeTableName: true, 
		timestamps: false
	});	

	retailercategorymap.associate = (models) => {
		retailercategorymap.belongsTo(models.category, {foreignKey: 'catid'});
		retailercategorymap.belongsTo(models.retailer, {foreignKey: 'retailerid'});
	}
	
    return retailercategorymap;
}

