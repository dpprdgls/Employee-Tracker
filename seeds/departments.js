//seed data for department table

const sequelize = require('../config/connection');
const Department = require('../models/department');

const departmentsSeedData = require('./departmentsSeedData.json');

const seedDepartmentData = async () => {
     // Disable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });

     // Drop the Department table
    await Department.sync({ force: true });
 
     // Insert data
    await Department.bulkCreate(departmentsSeedData);
 
     // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });

    process.exit(0);
};

seedDepartmentData();