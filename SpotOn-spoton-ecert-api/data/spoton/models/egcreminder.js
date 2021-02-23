export default function (sequelize, DataTypes) {

    const egcreminder = sequelize.define('egcreminder', {
	
		carddetid  : {
				type: DataTypes.BIGINT, allowNull: false, primaryKey: true,
		},
		
		cdclientcardsrno : {
				type: DataTypes.TEXT, allowNull: false, primaryKey:true
		},        
        emailid : {
				type: DataTypes.TEXT
		},
		
		claimhtml : {
				type: DataTypes.INTEGER
		},
		status : {
			    type: DataTypes.TEXT
        },
        eccid : {
                type: DataTypes.BIGINT
        } 
	}, {
		tableName: 'egcreminder', 
		freezeTableName: true,
		timestamps: false	
	});

	egcreminder.associate = (models) => {
		models.egcreminder.belongsTo(models.carddet, { foreignKey: 'carddetid'});
	};
	
    return egcreminder;
}
