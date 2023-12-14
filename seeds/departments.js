//seed data for department table

const sequelize = require('../config/connection');
const Department = require('../models/department');

const departmentsSeedData = require('./departmentsSeedData.json');

const seedDepartmentData = async () => {
    await sequelize.sync({ force: true });
    const departments = await Department.bulkCreate(deparmentsSeedData);

    process.exit(0);
};

seedDepartmentData();