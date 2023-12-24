// seed data for employee table

const sequelize = require('../config/connection');
const Employee = require('../models/employee');
const employeesSeedData = require('./employeesSeedData.json');

const seedEmployeeData = async () => {
    try {
        // Disable foreign key checks
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });

        // Drop the Employee table
        await Employee.sync({ force: true });

        // Insert data
        await Employee.bulkCreate(employeesSeedData);

        // Re-enable foreign key checks
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });

        console.log('Employee data seeded successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding employee data:', error);
        process.exit(1);
    }
};

seedEmployeeData();