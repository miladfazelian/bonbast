module.exports = (sequelize, DataTypes) => {
    const Mazaneh = sequelize.define("Mazaneh", {
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
    return Mazaneh;
}

