export default function (sequelize, DataTypes) {
    const customstyle = sequelize.define(
        'customstyle',
        {
            styleid: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            groupid: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            merchantid: {
                type: DataTypes.TEXT,
            },
            active: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            tableName: 'customstyle',
            freezeTableName: true,
            timestamps: false,
        }
    );

    return customstyle;
}
