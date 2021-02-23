import config from '../../../config/config';
export default function (sequelize, DataTypes) {

    const cardsenderinfo = sequelize.define('cardsenderinfo', {

		carddetid : {
				type: DataTypes.BIGINT, allowNull: false, primaryKey: true
		}, 
		
		sendername : {
				type: DataTypes.TEXT, allowNull: false
		}, 
		
		senderemail : {
				type: DataTypes.TEXT, allowNull: false, primaryKey: true
		},

		shiptoself : {
			 	type: DataTypes.TEXT, default: config.status.inactive
		}
	}, 
	{
		tableName: 'cardsenderinfo', freezeTableName: true, timestamps: false
	});
	
	cardsenderinfo.associate = (models) => {
		cardsenderinfo.belongsTo(models.carddet, { foreignKey: 'carddetid' });	
	};
	
    return cardsenderinfo;
}
