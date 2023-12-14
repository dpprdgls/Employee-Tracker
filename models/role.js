//Model structure of role table

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Role extends Model {}

Role.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
        },
        salary: {
            type: DataTypes.INTEGER,
        },
        department_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Department',
                key: 'id',
            },
        },
    },
      {  
            sequelize,
            timestamps: false,
            freezeTableName: true,
            underscored: true,
            modelName: 'Role',
    }
    
);

module.exports = Role;
