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
                    readEmployees();
                    break;
                case ("View Departments"):
                    viewDepartment();
                    break;
                case ("View Roles"):
                    viewRole();
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
            // createEmployee();
            init();
        });
}



const readEmployees = () => {
  console.log('Selecting all employees...\n');
  connection.query('SELECT * FROM employees', (err, res) => {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(res);
    console.log("/////////////////////////////");
    init();
  });
};

// const createEmployee = () => {
//     console.log('Inserting a new product...\n');
//     const query = connection.query(
//       'INSERT INTO products SET ?',
//       {
//         flavor: 'Rocky Road',
//         price: 3.0,
//         quantity: 50,
//       },
//       (err, res) => {
//         if (err) throw err;
//         console.log(`${res.affectedRows} product inserted!\n`);
//         // Call updateProduct AFTER the INSERT completes
//         updateProduct();
//       }
//     );
  
//     // logs the actual query being run
//     console.log(query.sql);
//   };



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

// const updateProduct = () => {
//   console.log('Updating all Rocky Road quantities...\n');
//   const query = connection.query(
//     'UPDATE products SET ? WHERE ?',
//     [
//       {
//         quantity: 100,
//       },
//       {
//         flavor: 'Rocky Road',
//       },
//     ],
//     (err, res) => {
//       if (err) throw err;
//       console.log(`${res.affectedRows} products updated!\n`);
//       // Call deleteProduct AFTER the UPDATE completes
//       deleteProduct();
//     }
//   );

//   // logs the actual query being run
//   console.log(query.sql);
// };


// Connect to the DB
connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  readEmployees();
});
