// seed data for role table

const sequelize = require('../config/connection');
const Role = require('../models/role');

const rolesSeedData = require('./rolesSeedData.json');

const seedRoleData = async () => {
    await sequelize.sync({ force: true });
    const roles = await Role.bulkCreate(rolesSeedData);

    process.exit(0);
};

seedRoleData();