export default function (sequelize, DataTypes) {

    const category = sequelize.define('category', {
	
		catid  : {
			type: DataTypes.INTEGER, primaryKey: true,
		},
		
		catdesc : {
			type: DataTypes.TEXT, allowNull: false
		}
	}, {
		tableName: 'category', 
		freezeTableName: true,
		timestamps: false
	});	

	category.associate = (models) => {
		category.belongsToMany(models.card, { through: 'catcardmap', foreignKey: 'catid', otherKey: 'cardid' });
		category.belongsTo(models.retailercategorymap, { as: 'Category',foreignKey: 'catid'});
		category.hasMany(models.promoconfig, {foreignKey: 'catid'});
	}
	
    return category;
}
