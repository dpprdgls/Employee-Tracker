const Department = require('./department');
const Role = require('./role');
const Employee = require('./employee');


//Lets describe the relations between the tables

//Role belongs to Department

Role.belongsTo(Department, {
    foreignKey: 'department_id',
    onDelete: 'CASCADE',
});

//Department has many Roles

Department.hasMany(Role, {
    foreignKey: 'department_id',
    onDelete: 'CASCADE',
});

//Employee belongs to Role

Employee.belongsTo(Role, {
    foreignKey: 'role_id',
    onDelete: 'CASCADE',
});

// Role has one employee 

Role.hasOne(Employee, {
    foreignKey: 'role_id',
    onDelete: 'CASCADE',
});

//Employee has one Manager (Employee)

Employee.hasOne(Employee, {
    foreignKey:'manager_id',
    onDelete: 'CASCADE',
});

module.exports = { Department, Role, Employee };