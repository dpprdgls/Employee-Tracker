# Note Taker

  
  ![Badge for GitHub repo top language](https://img.shields.io/github/languages/top/dpprdgls/Employee-Tracker?style=flat&logo=appveyor) ![Badge for GitHub last commit](https://img.shields.io/github/last-commit/dpprdgls/Employee-Tracker?style=flat&logo=appveyor)
  

  ## Description

  *The purpose, the motivation, the execution:*

  The purpose of this application is to allow business owners to view and manage the departments, roles and employees within their company. It was motivated by the need to create an application that can easily query the database without long SQL queries that the user would have to enter themselves. To avoid the user having to manually enter their SQL queries to get the desired results the database implements a sequelize dependency allowing the user to answer Inquirer prompts to get their data. 


  ## Table of Contents
  * [Installation](#installation)
  * [Usage](#usage)
  * [License](#license)
    
    ## Installation
    
    *Steps required to install project and how to get the development environment running:*
  
    You can clone the repository to you local hard drive. Open the project in VS Code, if you do not have VS code you must install it. Navigate to the project folder within the terminal and run `npm init -y` to initialize your node environment and create a package.json where the project will be stored. Next use the terminal to execute the command `npm i` to install the project dependencies. To create the database for the project you will need to navigate to the project file containing the schema.sql file. Once there you will need to open a MySQL shell and run the command `source schema.sql`. Once the database is created you will need to navigate to the root directory to seed the database with the following command: `npm run seed`. After this command is sucessfully executed you can run the command `npm start` to start the application.  
    
    ## Usage

    ![Usage Gif](/img/usage.gif)
   


    *Instructions and examples for use:*
    
    Once the application is started, the user will be prompted to select from the list of available choices. The user will be able to view a department, role or employee table, they will also have the ability to add a new department, role, or employee to the database. They can also update an emploee's role, delete an employee or delete a role if no employees exist within that role. 

     [Video Link](https://drive.google.com/file/d/1gKonSccgi_U9sUg8HgyvD0ZlOM8u9ldo/view)
    
    ## License
    
    This project is covered under the MIT License license.
  ---

  ## Questions? 

  <img src="https://avatars.githubusercontent.com/u/74167696?v=4" alt="dpprdgls" width="40%" />

  For any questions or concerns, feel free to contact me using the information below:
  
  GitHub: [@dpprdgls](https://api.github.com/users/dpprdgls)

  