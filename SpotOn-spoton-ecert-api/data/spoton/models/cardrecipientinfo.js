
export default function (sequelize, DataTypes) {

    const cardrecipientinfo = sequelize.define('cardrecipientinfo', {

		carddetid : {
			type: DataTypes.BIGINT, allowNull: false, primaryKey: true
		}, 
		
		recipientname : {
				type: DataTypes.TEXT, allowNull: false
		}, 
		
		recipientemail : {
				type: DataTypes.TEXT, allowNull: false, primaryKey: true
		}
	}, 
	{
		tableName: 'cardrecipientinfo', freezeTableName: true, timestamps: false
    });
	
	cardrecipientinfo.associate = (models) => {
		cardrecipientinfo.belongsTo(models.carddet, { foreignKey: 'carddetid' });	
	};
	
    return cardrecipientinfo;
}