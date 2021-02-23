
export default function (sequelize, DataTypes) {

    const usertrans = sequelize.define('usertrans', {
		
		usertransid : {
				type: DataTypes.BIGINT, allowNull: false, primaryKey: true, autoIncrement: true
		}, 
		
		utdate : {
				type: DataTypes.BIGINT
		}, 
		
		utipaddr : {
				type: DataTypes.TEXT
		}, 
		
		retailerid : {
				type: DataTypes.INTEGER
		}, 
		
		utrefererurl : {
				type: DataTypes.TEXT
		},
		merchantid : {
			type: DataTypes.TEXT
		}
	}, {		
		tableName: 'usertrans', freezeTableName: true, timestamps: false
	});	
	
    return usertrans;
}