

const { Department, Role, Employee } = require('./models');
const sequelize = require('./config/connection');
const inquirer = require('inquirer');



sequelize.sync({ force: false }).then(() => {

    options();
});


// Function written to prompt the user with different options to navigate the database
function options() {
    inquirer
      .prompt([
        {
          type: "list",
          message: "What would you like to do?",
          choices: [
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "Add Department",
            "Add Role",
            "Add Employee",
            "Update Employee Role",
            "Delete Employee", 
            "Delete Role",
            //   `(Move up and down to reveal more choices)`,
          ],
          name: "employeeTracker",
        },
      ])
      // Takes in user choice, checks with equality, and then fires off corresponding function
      .then((answer) => {
        if (answer.employeeTracker === "View All Departments") {
            viewAllDepartments();
        } else if (answer.employeeTracker === "View All Roles") {
            viewAllRoles();
        } else if (answer.employeeTracker === "View All Employees") {
            viewAllEmployees();
        } else if (answer.employeeTracker === "Add Department") {
            addDepartment();
        } else if (answer.employeeTracker === "Add Role") {
            addRole();
        } else if (answer.employeeTracker === "Add Employee") {
            addEmployee();
        } else if (answer.employeeTracker === "Delete Employee") {
            deleteEmployee();
        } else if (answer.employeeTracker === "Delete Role") {
            deleteRole();
        } else {
            updateEmployeeRole();
        }
      });
  }
  
  // -------------- VIEW -----------------
  
  // View all departments
  const viewAllDepartments = () => {
    var departments = Department.findAll({ raw: true }).then((data) => {
      console.table(data);
      // Fires off prompts after table is displayed
      options();
    });
  };
  
  // View all roles
  const viewAllRoles = () => {
    var roles = Role.findAll({
      raw: true,
      // Joining Department table and Role table
      include: [{ model: Department }],
    }).then((data) => {
      console.table(
        // Loops through data and returns new object, used to format tables
        data.map((role) => {
          return {
            id: role.id,
            title: role.title,
            salary: role.salary,
            department: role["Department.name"],
          };
        })
      );
      // Fires off prompts after table is displayed
      options();
    });
  };
  
  // View all employees
  const viewAllEmployees = () => {
    var employees = Employee.findAll({
      raw: true,
      // Joining Role table, and Department table with Employee table
      include: [{ model: Role, include: [{ model: Department }] }],
    }).then((data) => {
      const employeeLookup = {};
      // For loop used to grab employee names to be inserted below into managers column in newly created table
      for (var i = 0; i < data.length; i++) {
        const employee = data[i];
        //If the manager_id is null, use a default value ('None')
        const managerName = employee.manager_id ? employeeLookup[employee.manager_id] : "None";
        employeeLookup[employee.id] =
          employee.first_name + " " + employee.last_name;
      }
      console.table(
        // Loops through data and returns new object, used to format tables
        data.map((employee) => {
          return {
            id: employee.id,
            first_name: employee.first_name,
            last_name: employee.last_name,
            title: employee["Role.title"],
            department: employee["Role.Department.name"],
            salary: employee["Role.salary"],
            manager: employeeLookup[employee.manager_id] || "None",
          };
        })
      );
      // Fires off prompts after table is displayed
      options();
    });
  };

  // -------------- ADD -----------------
  
  // Add department
  const addDepartment = () => {
    // Prompts user for name of new department
    inquirer
      .prompt([
        {
          type: "input",
          message: "What would you like to name the department?",
          name: "addDepartment",
        },
      ])
      // Takes in user input and adds answer to database
      .then((answer) => {
        Department.create({ name: answer.addDepartment }).then((data) => {
          // Fires off prompts after updating database
          options();
        });
      });
  };
  
  // Add role
  const addRole = async () => {
    // Same as -> SELECT id AS VALUE, name AS name FROM Department;
    let departments = await Department.findAll({
      attributes: [
        ["id", "value"],
        ["name", "name"],
      ],
    });
    // Restructures raw data
    departments = departments.map((department) =>
      department.get({ plain: true })
    );
  
    // Prompts user for new role name, salary, and corresponding department
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the name of the role?",
          name: "title",
        },
        {
          type: "input",
          message: "What would you like the salary to be?",
          name: "salary",
        },
        {
          type: "list",
          message: "What department would you like to add this new role to?",
          name: "department_id",
          choices: departments,
        },
      ])
      // Takes in user inputs and adds answers to database
      .then((answer) => {
        Role.create(answer).then((data) => {
          // Fires off prompts after updating database
          options();
        });
      });
  };
  
  // Add employee
  const addEmployee = async () => {
    // Fetch available roles
    let roles = await Role.findAll({
      attributes: [
        "id",
        "title",
        "department_id",
        [sequelize.literal("`Department`.`id`"), "Department.id"],
        [sequelize.literal("`Department`.`name`"), "Department.name"],
      ],
      include: [{ model: Department, attributes: [] }],
    });
  
    // Restructures raw data
    roles = roles.map((role) => {
      const plainRole = role.get({ plain: true });
      return {
        value: plainRole.id,
        name: plainRole.title,
        department_id: plainRole.department_id,
        department_name: plainRole["Department.name"],
      };
    });
  
    // Fetch available managers in the same department as the selected role
    const roleAnswer = await inquirer.prompt([
      {
        type: "input",
        message: "What is the first name of the new employee?",
        name: "first_name",
      },
      {
        type: "input",
        message: "What is the last name of the new employee?",
        name: "last_name",
      },
      {
        type: "list",
        message: "What is the role of the new employee?",
        name: "role_id",
        choices: roles,
      },
    ]);
  
    const selectedRole = roles.find((role) => role.value === roleAnswer.role_id);
  
    let managers = await Employee.findAll({
      attributes: ["id", "first_name", "last_name", "role_id"],
      where: {
        role_id: roleAnswer.role_id,
      },
    });
  
    // Restructures raw data
    managers = managers.map((manager) => {
      const plainManager = manager.get({ plain: true });
      return {
        name: `${plainManager.first_name} ${plainManager.last_name}`,
        value: plainManager.id,
      };
    });
  
    managers.push({ name: "None", value: null });
  
    // Prompt user to select a manager
    const managerAnswer = await inquirer.prompt([
      {
        type: "list",
        message: "What manager would you like to assign to the new employee?",
        name: "manager_id",
        choices: managers,
      },
    ]);
  
    // Combine user answers
    const finalAnswer = {
      ...roleAnswer,
      manager_id: managerAnswer.manager_id,
    };
  
    // Add the employee to the database
    Employee.create(finalAnswer).then((data) => {
      // Fires off prompts after updating database
      viewAllEmployees();
    });
  };

    
// -------------- DELETE -----------------

//Function to delete an employee

const deleteEmployee = async () => {
    //Get the list of employees for user selection

    let employees = await Employee.findAll ({
        attributes: [
            ["id", "value"],
            ["first_name", "first_name"],
            ["last_name", "last_name"],
        ],
    });
    // Restructures raw data
    employees = employees.map((employee) => {
        employee.get({ plain: true });
        const employeeInfo = employee.get();
        return {
            name: `${employeeInfo.first_name} ${employeeInfo.last_name}`,
            value: employeeInfo.value,
        };
    });

    // Prompts user to select employee to be deleted
    inquirer
    .prompt ([
        {
            type: 'list',
            message: 'Which employee would you like to delete?',
            name: 'id',
            choices: employees,
        },
    ])
    .then(async (answer) => {
        //Delete the selected employee
        await Employee.destroy({
            where: {
                id: answer.id,
            },
        });
        console.log('Employee deleted successfully.');
        
        viewAllEmployees();
    });
};

const deleteRole = async () => {
    let roles = await Role.findAll({
        attributes: [
            "id",
            "title",
            [sequelize.literal("`Department`.`name`"), "department_name"],
        ],
        include: [{ model: Department, attributes: [] }],
    });

    roles = roles.map((role) => {
        const plainRole = role.get({ plain: true });
        return {
            value: plainRole.id,
            name: `${plainRole.title} (${plainRole.department_name})`,
        };
    });

    const answer = await inquirer.prompt([
        {
            type: 'list',
            message: 'Which role would you like to delete?',
            name: 'role_id',
            choices: roles,
        },
    ]);

    const roleToDelete = roles.find((role) => role.value === answer.role_id);

    const employeesCount = await Employee.count({
        where: {
            role_id: answer.role_id,
        },
    });

    if (employeesCount === 0) {
        console.log(`Role "${roleToDelete.name}" has been deleted.`);
        
        // Delete the role from the database
        await Role.destroy({
            where: {
                id: answer.role_id,
            },
        });
    } else {
        console.log(`Can't delete role "${roleToDelete.name}" because it has ${employeesCount} employee(s) assigned to it.`);
    }

    // Refresh the view after deletion
    viewAllRoles();
};

// -------------- UPDATE -----------------
  
  // Update employee role
  const updateEmployeeRole = async () => {
    let employees = await Employee.findAll({
      attributes: [
        ["id", "value"],
        ["first_name", "name"],
        ["last_name", "lastName"],
      ],
    });
    // Restructures raw data
    employees = employees.map((employee) => {
      employee.get({ plain: true });
      const employeeInfo = employee.get();
      return {
        name: `${employeeInfo.name} ${employeeInfo.lastName}`,
        value: employeeInfo.value,
      };
    });
  
    let roles = await Role.findAll({
      attributes: [
        ["id", "value"],
        ["title", "name"],
      ],
    });
    // Restructures raw data
    roles = roles.map((role) => role.get({ plain: true }));
  
    // Prompts user to select employee whose role will be updated, and new role of said employee
    inquirer
      .prompt([
        {
          type: "list",
          message: "Who is the employee whose role you would like to update?",
          name: "id",
          choices: employees,
        },
        {
          type: "list",
          message:
            "What is the name of the updated role would you like to assign to this employee?",
          name: "role_id",
          choices: roles,
        },
      ])
      // Takes in user inputs and adds answers to database
      .then((answer) => {
        // Gives point of reference within database to where data should be updated
        Employee.update(answer, {
          where: {
            id: answer.id,
          },
        }).then((data) => {
          // Fires off prompts after updating database
          options();
        });
      });
  };

