export default function (sequelize, DataTypes) {

    const promoconfig = sequelize.define('promoconfig', {

		pcid : {
			type: DataTypes.BIGINT, allowNull: false, primaryKey: true, autoIncrement: true
		}, 
		
		groupid : {
            type: DataTypes.TEXT, allowNull: false
		}, 
		
		merchantid : {
            type: DataTypes.TEXT, allowNull: true
		}, 
		 
		fromdate : {
            type: DataTypes.DATE
		}, 
		
		todate : {
            type: DataTypes.DATE
        },
        
        catid : {
            type: DataTypes.INTEGER
        },

        active : {
            type: DataTypes.BOOLEAN,
        },

        showbanner : {
            type: DataTypes.BOOLEAN, 
        },

        bannername : {
            type: DataTypes.TEXT
        }
        
	}, {	
		tableName: 'promoconfig', 
		freezeTableName: true,
		timestamps: false
    });	

    promoconfig.associate = (models) => {
        // promoconfig.belongsToMany(models.card, { through: 'catcardmap', foreignKey: 'catid', otherKey: 'cardid' });
        promoconfig.belongsTo(models.category, {foreignKey: 'catid'});
        promoconfig.hasMany(models.promoconfigdtl, {foreignKey: 'pcid'});
	};
    
    return promoconfig;
}
