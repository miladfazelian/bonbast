module.exports = (sequelize, DataTypes) => {
    const Ounce = sequelize.define("Ounce", {
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
    return Ounce;
}

