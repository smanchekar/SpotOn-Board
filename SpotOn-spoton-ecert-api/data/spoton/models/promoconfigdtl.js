export default function (sequelize, DataTypes) {

    const promoconfigdtl = sequelize.define('promoconfigdtl', {

		pcdid : {
            type: DataTypes.BIGINT, 
            allowNull: false, 
            primaryKey: true, 
            autoIncrement: true
		}, 
		
		pcid : {
            type: DataTypes.BIGINT, allowNull: false
		}, 
		
		minvalue : {
            type: DataTypes.DOUBLE, allowNull: false
        }, 
        
        dollarvalue : {
            type: DataTypes.DOUBLE, allowNull: false
		}, 
		 
		qty : {
            type: DataTypes.INTEGER
        }
        
	}, {	
		tableName: 'promoconfigdtl', 
		freezeTableName: true,
		timestamps: false
    });	

    promoconfigdtl.associate = (models) => {
		promoconfigdtl.belongsTo(models.promoconfig, {foreignKey: 'pcid'});
	};
    
    return promoconfigdtl;
}
