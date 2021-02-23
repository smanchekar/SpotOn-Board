export default function (sequelize, DataTypes) {
    const invoice = sequelize.define(
        "invoice",
        {
            invno: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },

            invtransid: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },

            invdate: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },

            invtotal: {
                type: DataTypes.REAL,
                allowNull: false,
            },

            invstatus: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            invordernum: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            clientordersrno: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            groupid: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            merchantid: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            retailername: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            retailerlogo: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            tableName: "invoice",
            freezeTableName: true,
            timestamps: false,
        }
    );

    invoice.associate = (models) => {
        invoice.hasMany(models.invlineitems, { foreignKey: "invno" });
    };

    return invoice;
}
