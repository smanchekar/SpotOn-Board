export default function (sequelize, DataTypes) {

    const retailerprofile = sequelize.define('retailerprofile', {
		retailerid  : {
				type: DataTypes.INTEGER, allowNull: false, primaryKey: true,
		}, 
		
		retailerprofilename  : {
				type: DataTypes.TEXT, allowNull: false, primaryKey: true,
		},
		
		retailerprofilevalue  : {
				type: DataTypes.TEXT
		}
	}, {		
		tableName: 'retailerprofile', 
		freezeTableName: true, 
		timestamps: false
	});	

	retailerprofile.associate = (models) => {
		models.retailerprofile.belongsTo(models.retailer , { foreignKey: 'retailerid' });	
	};
	
	return retailerprofile;
}
