const mysql = require('mysql');
const inquirer = require("inquirer");
// const express = require("inquirer");

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: 'yourRootPassword',
  database: 'company_hw',
});

//////////////////////////

const initialPrompt = [
    {
        type: "list",
        message: "Would you like to do?",
        choices: ["View All Employees", "View Departments", "View Roles", "Add Employee", "Add Department", "Add Role", "Update Employee", "Quit Application"],
        name: "initPrompt"
    }
];

const EmployeeData = [
    {
        type: "input",
        message: "What is their first name?",
        name: "firstName",
      },
      {
        type: "input",
        message: "What is their last name?",
        name: "lastName",
      },
      {
        type: "list",
        message: "What is their role?",
        choices: ["hot dog eater", "monster", "queen"],
        name: "role",
      },
      {
        type: "list",
        message: "Who is their manager?",
        choices: ["Billie", "yo momma", "Beyonce"],
        name: "manager"
      }
];


function init(){
    inquirer.prompt(initialPrompt).then(
        response => {
            console.log(response);
            switch (response.initPrompt) {
                case ("View All Employees"):
                    viewEmployees();
                    break;
                case ("View Departments"):
                    viewDepartments();
                    break;
                case ("View Roles"):
                    viewRoles();
                    break;
                case ("Add Employee"):
                    addEmployee();
                    break;
                case ("Add Role"):
                    addRole();
                    break;
                case ("Update Employee"):
                    updateEmployee();
                    break;
                case ("Quit Application"):
                    connection.end();
                    break;
            }
           
        });
}


// function viewEmployees(){
//     inquirer.prompt(EmployeeData).then(
//         response => {
//             console.log(response);
//             readEmployee();
//         });
// }


function addEmployee(){
    inquirer.prompt(EmployeeData).then(
        response => {
            console.log(response);
            const firstName = response.firstName;
            const lastName = response.lasttName;
            const role = response.role;
            const manager = response.manager;
            let roleID = 0;
            
            if (role === "hot dog eater"){
                roleID = 1;
            } else if (role === "monster"){
                roleID = 2;
            } else if (role === "queen"){
                roleID = 3;
            } else {
                console.log("invalid role");
            }

            let managerID = 0;
            if (manager === "Billie"){
                managerID = 1;
            } else if (manager === "yo momma"){
                managerID = 2;
            } else if (manager === "Beyonce"){
                managerID = 3;
            } else {
                console.log("invalid role");
            }

            createEmployee(firstName, lastName, roleID, managerID);
            init();
        });
}



const viewEmployees = () => {
  console.log('Selecting all employees...\n');
  connection.query('SELECT * FROM employees', (err, res) => {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(res);
    console.log("/////////////////////////////");
    init();
  });
};

const viewDepartments = () => {
    console.log('Selecting all departments...\n');
    connection.query('SELECT * FROM departments', (err, res) => {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log(res);
      console.log("/////////////////////////////");
      init();
    });
};

const viewRoles = () => {
    console.log('Selecting all roles...\n');
    connection.query('SELECT * FROM roles', (err, res) => {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log(res);
      console.log("/////////////////////////////");
      init();
    });
};

const createEmployee = (firstName, lastName, roleID, managerID) => {
    console.log('Inserting a new employee...\n');
    const query = connection.query(
      'INSERT INTO employees SET ?',
      {
        first_name: `${firstName}`,
        last_name: `${lastName}`,
        role_id: `${roleID}`,
        manager_id: `${managerID}`
      },
      (err, res) => {
        if (err) throw err;
        console.log(`${res.affectedRows} employee inserted!\n`);
        // Call updateProduct AFTER the INSERT completes
        updateProduct();
      }
    );
  
    // logs the actual query being run
    console.log(query.sql);
  };


  


// const deleteProduct = () => {
//   console.log('Deleting all strawberry icecream...\n');
//   connection.query(
//     'DELETE FROM products WHERE?',
//     {
//       flavor: 'strawberry',
//     },
//     (err, res) => {
//       if (err) throw err;
//       console.log(`${res.affectedRows} products deleted!\n`);
//       // Call readProducts AFTER the DELETE completes
//       readProducts();
//     }
//   );
// };


const readEmployees = () => {
    console.log('Selecting all employees...\n');
    connection.query('SELECT * FROM employees', (err, res) => {
      if (err) throw err;
      // Log all results of the SELECT statement
      init();
    });
  };


// Connect to the DB
connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  viewEmployees();
});
