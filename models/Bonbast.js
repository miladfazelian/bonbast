module.exports = (sequelize,DataTypes)=>{
    const Bonbast = sequelize.define("Bonbast",{
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
        aed: {
            type: DataTypes.STRING,
            allowNull : false,
            validate:{
                notEmpty: true,
            }
        },
        rial: {
            type: DataTypes.STRING,
            allowNull : false,
            validate:{
                notEmpty: true,
            }
        },
    });
    return Bonbast;
}