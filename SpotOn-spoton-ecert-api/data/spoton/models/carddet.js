import config from '../../../config/config';

export default function (sequelize, DataTypes) {

    const carddet = sequelize.define('carddet', {

		carddetid : {
				type: DataTypes.BIGINT, allowNull: false, primaryKey: true, autoIncrement: true
		}, 
		
		cardid : {
				type: DataTypes.INTEGER, allowNull: false
		}, 
		
		transid : {
				type: DataTypes.BIGINT, allowNull: false
		}, 
		
		retailerid : {
				type: DataTypes.INTEGER, allowNull: false
		}, 
		
		lineitemid : {
				type: DataTypes.INTEGER, allowNull: false
		}, 
		
		denomination : {
				type: DataTypes.REAL, allowNull: false
		}, 
		
		personalmessage : {
				type: DataTypes.TEXT
		}, 
		
		cardimage : {
				type: DataTypes.TEXT
		},

		clientid : {
			type: DataTypes.REAL, allowNull: false
		},
	
		clientcardsrno : {
			type: DataTypes.TEXT
		},

		merchantid : {
			type: DataTypes.TEXT
		},

		shipdatetime : {
			type: DataTypes.DATE
		},

		cdstatus: {
			type: DataTypes.TEXT, allowNull: false
		},

		type: {
			type: DataTypes.TEXT, 
			allowNull: false,
			default: config.carddetType.giftcard
		}
	}, 
	{
		tableName: 'carddet', freezeTableName: true, timestamps: false
	});

	carddet.associate = (models) => {
		carddet.belongsTo(models.cardsenderinfo, { foreignKey: 'carddetid' });
		carddet.belongsTo(models.cardrecipientinfo, { foreignKey: 'carddetid' });	
		carddet.belongsTo(models.retailer, { foreignKey: 'retailerid' });		
		carddet.belongsTo(models.card, { foreignKey: 'cardid' });
		carddet.belongsTo(models.retailercardnumbers, { foreignKey: 'carddetid'});
		carddet.belongsTo(models.egcreminder, { foreignKey: 'carddetid'});
		carddet.belongsTo(models.invoice, {foreignKey: 'carddetid', through: models.invlineitems});
    }
	
    return carddet;
}