export default function (sequelize, DataTypes) {
    const user = sequelize.define(
        "users",
        {
            uid: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            password: {
                type: DataTypes.BLOB,
                allowNull: false,
            },
            firstname: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            lastname: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            email: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            active: {
                type: DataTypes.INTEGER,
            },
            roleid: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            phone: {
                type: DataTypes.TEXT,
            },
            createdAt: {
                type: DataTypes.BIGINT,
            },
            updatedAt: {
                type: DataTypes.BIGINT,
            },
            requesttoken: {
                type: DataTypes.TEXT,
            },
            lastlogouttime: {
                type: DataTypes.BIGINT,
            },
        },
        {
            tableName: "users",
            freezeTableName: true,
            timestamps: false,
        }
    );

    return user;
}
