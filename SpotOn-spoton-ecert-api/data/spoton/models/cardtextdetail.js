export default function (sequelize, DataTypes) {

    const cardtextdetail = sequelize.define('cardtextdetail', {
	
		retailerid  : {
				type: DataTypes.INTEGER, allowNull: false, primaryKey: true
		},
		
		clientid : {
				type: DataTypes.INTEGER, allowNull: false, primaryKey: true
		},
		
		cardid : {
				type: DataTypes.INTEGER, allowNull:false, primaryKey: true
		},		
		ctdtext : {
				type: DataTypes.TEXT, allowNull:false
		},
		ctdstyle : {
			type: DataTypes.TEXT,allowNull:false
		}
	}, {		
		tableName: 'cardtextdetail', 
		freezeTableName: true,
		timestamps: false	
    });
	
    return cardtextdetail;
}
