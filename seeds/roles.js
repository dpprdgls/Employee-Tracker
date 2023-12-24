// seed data for role table

const sequelize = require('../config/connection');
const Role = require('../models/role');

const rolesSeedData = require('./rolesSeedData.json');

const seedRoleData = async () => {
       // Disable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });

       // Drop the Department table
    await Role.sync({ force: true });
   
       // Insert data
    await Role.bulkCreate(rolesSeedData);
   
       // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
  
    process.exit(0);
};

seedRoleData();