export default function (sequelize, DataTypes) {

    const invpaymentdetails = sequelize.define('invpaymentdetails', {
	
		ipdinvno : {
				type: DataTypes.BIGINT, allowNull: false
		}, 
		
		ipdsrno : {
				type: DataTypes.TEXT, allowNull: false, primaryKey : true, autoIncrement: true
		},
		ipdpcamt: {
				type: DataTypes.REAL
		},
		ipdpaymentstatus : {
				type: DataTypes.TEXT
		},		
		ipdpcfname : {
				type: DataTypes.TEXT
		},		
		ipdpclname : {
				type: DataTypes.TEXT
		},		
		ipdemailid : {
				type: DataTypes.TEXT
		},
		ipdpcresponsemsg : {
				type: DataTypes.TEXT
		},		
		ipdpcnoquad : {
				type: DataTypes.TEXT
		},		
		ipdsettlementdate : {
				type: DataTypes.BIGINT
		}, 
		ipdpcauthreceiptno : {
				type: DataTypes.TEXT
		},
		ipdcctype: {
				type: DataTypes.TEXT
		},
		ipdinvpaymenttoken : {
			type: DataTypes.TEXT, allowNull: false
		}
	}, {	
		tableName: 'invpaymentdetails', 
		freezeTableName: true,
		timestamps: false
	});	
	
	
    return invpaymentdetails;
}