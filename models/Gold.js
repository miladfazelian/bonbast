module.exports = (sequelize, DataTypes) => {
    const Gold = sequelize.define("Gold", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        price: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
    });
    return Gold;
}