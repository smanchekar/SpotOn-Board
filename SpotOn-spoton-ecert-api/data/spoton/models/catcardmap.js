export default function (sequelize, DataTypes) {

    const catcardmap = sequelize.define('catcardmap', {
	
        catid : {
                type: DataTypes.INTEGER, allowNull: false
        },
        
        cardid : {
                type: DataTypes.INTEGER, allowNull: false
        },
        
        carddisplayorder: {
            type: DataTypes.INTEGER, allowNull: false
        }
    }, 
    {
        tableName: 'catcardmap', 
        freezeTableName: true,
        timestamps: false
        });	
		
        catcardmap.associate = (models) => {
                catcardmap.belongsTo(models.category, {foreignKey: 'catid'});
                catcardmap.belongsTo(models.card, {foreignKey: 'cardid'});
        };
        
    return catcardmap;
}
