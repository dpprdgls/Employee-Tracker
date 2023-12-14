//seed data for employee table

const sequelize = require('../config/connection');
const Employee = require('../models/employee');

const employeesSeedData = require('./employeesSeedData.json');

const seedEmployeeData = async () => {
    await sequelize.sync({ force: true });
    const employees = await Employee.bulkCreate(employeesSeedData);

    process.exit(0);
};

seedEmployeeData();