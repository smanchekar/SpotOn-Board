export default function (sequelize, DataTypes) {

    const invlineitems = sequelize.define('invlineitems', {

		invno : {
			type: DataTypes.BIGINT, allowNull: false, primaryKey : true
		},  
		
		carddetid : {
			type: DataTypes.BIGINT, allowNull: false, primaryKey : true
		}, 
	}, {	
		tableName: 'invlineitems', 
		freezeTableName: true,
		timestamps: false
	});	

	invlineitems.associate = (models) => {
		invlineitems.belongsTo(models.invoice, {foreignKey: 'invno'});
		invlineitems.belongsTo(models.carddet, {foreignKey: 'carddetid'});
	};
	
    return invlineitems;
}