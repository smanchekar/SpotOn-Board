export default function (sequelize, DataTypes) {

    const card = sequelize.define('card', {
	
		cardid  : {
				type: DataTypes.INTEGER, allowNull: false, primaryKey: true,
		},
		
		carddesc : {
				type: DataTypes.TEXT, allowNull: false
		},
		
		cardimagename : {
				type: DataTypes.TEXT
		},
		
		cardtemplate : {
			type: DataTypes.TEXT
		}
	}, {		
		tableName: 'card', 
		freezeTableName: true,
		timestamps: false	
	});

	card.associate = (models) => {
        card.belongsTo(models.category, { through: 'catcardmap', foreignKey: 'cardid', otherKey: 'catid' });
		card.belongsTo(models.carddet, { foreignKey: 'cardid'});
    }
	
    return card;
}
