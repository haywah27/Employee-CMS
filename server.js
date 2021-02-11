const mysql = require('mysql');
const inquirer = require("inquirer");
const cTable = require('console.table');
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



const readRoles = () => {
    console.log('Selecting all employees...\n');
    connection.query('SELECT title FROM roles', (err, res) => {
      if (err) throw err;

      var roles = res.map(function(item){
          return item['title']
      })

        // var result = JSON.parse(JSON.stringify(res))

    //   let poop = 
      roleArr = roles;

      console.log(roleArr);
    });
  };



const employeeData = [
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
        choices: ["Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer", "Accountant", "Legal Team Lead", "Lawyer"],
        name: "role",
      },
      {
        type: "list",
        message: "Who is their manager?",
        choices: ["Hayley", "Billie", "Aspen",],
        name: "manager"
      }
];


// "Billie", "Hayley", "Oscar", "Aspen"
const departData = [
    {
        type: "input",
        message: "What department would you like to add?",
        name: "newDepartment"
    }
]

const roleData = [
    {
        type: "input",
        message: "What role would you like to add?",
        name: "newRole"
    },
    {
        type: "input",
        message: "What salary does this role earn?",
        name: "newRole"
    }
]


function init(){
   
    inquirer.prompt(initialPrompt).then(
        response => {
            
            console.log("you chose the option: ", response.initPrompt);
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
//     inquirer.prompt(employeeData).then(
//         response => {
//             console.log(response);
//             readEmployee();
//         });
// }


function addEmployee(){
    inquirer.prompt(employeeData).then(
        response => {
            
            console.log(response);
            const firstName = response.firstName;
            const lastName = response.lastName;
            const roleID = response.role;
            let managerID = response.manager;

            if (managerID === "Hayley"){
                managerID = 1;
            } else if (managerID === "Billie"){
                managerID = 2;
            } else if (managerID === "Aspen"){
                managerID = 3;
            } else {
                managerID = "NULL";
            }

            createEmployee(firstName, lastName, roleID, managerID);
            init();
        });
}

function addDepartment(){
    inquirer.prompt(departData).then(
        response => {
            console.log(response);
            const dept = response.newDepartment;

            createDept(dept);
            init();
        });
}





const viewEmployees = () => {
  console.log('Selecting all employees...\n');
  connection.query('SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department, roles.salary, managers.manager_name FROM employees INNER JOIN roles ON roles.id = employees.role_id INNER JOIN departments ON departments.id = roles.department_id LEFT JOIN managers ON managers.id = employees.manager_id', (err, res) => {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
    console.log("/////////////////////////////");
    init();
  });
};

const viewDepartments = () => {
    console.log('Selecting all departments...\n');
    connection.query('SELECT * FROM departments', (err, res) => {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.table(res);
      console.log("/////////////////////////////");
      init();
    });
};

const viewRoles = () => {
    console.log('Selecting all roles...\n');
    connection.query('SELECT roles.id, roles.title, roles.salary, departments.department FROM roles INNER JOIN departments ON departments.id = roles.department_id;', (err, res) => {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.table(res);
      console.log("/////////////////////////////");
      init();
    });
};

const createEmployee = (firstName, lastName, roleID, managerID) => {
    console.log('Inserting a new employee...\n');
    if (managerID === "NULL"){

        connection.query('INSERT INTO employees SET ?',
        {
          first_name: `${firstName}`,
          last_name: `${lastName}`,
          role_id: `${roleID}`,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} employee inserted!\n`);
          // Call updateProduct AFTER the INSERT completes
          updateEmployee(firstName, lastName, roleID, managerID);
          init();
        }
      );
  
    } else {
    
    connection.query('INSERT INTO employees SET ?',
      {
        first_name: `${firstName}`,
        last_name: `${lastName}`,
        role_id: `${roleID}`,
        manager_id: `${managerID}`,
      },
      (err, res) => {
        if (err) throw err;
        console.log(`${res.affectedRows} employee inserted!\n`);
        // Call updateProduct AFTER the INSERT completes
        updateEmployee(firstName, lastName, roleID, managerID);
        init();
      }
    );
    }
    // logs the actual query being run
    console.log(query.sql);
  };



const updateEmployee = (firstName, lastName, roleID, managerID) => {
    console.log('Updating new employee data...\n');
    const query = connection.query(
    'UPDATE employees SET ? WHERE ?',
    [
        {
            first_name: `${firstName}`,
        },
        {
            last_name: `${lastName}`,
        },
        {
            role_ID: `${roleID}`,
        },
        {
            manager_ID: `${managerID}`,
        },
    ],
    (err, res) => {
        if (err) throw err;
        console.log(`${res.affectedRows} employee table updated!\n`);
        // Call deleteProduct AFTER the UPDATE completes
    }
    );

    // logs the actual query being run
    console.log(query.sql);
};

function createDept(dept) {
    console.log('Inserting a new department...\n');

    connection.query('INSERT INTO departments SET ?',
      {
        name: `${dept}`,
      },
      (err, res) => {
        if (err) throw err;
        console.log(`${res.affectedRows} department inserted!\n`);
        // Call updateProduct AFTER the INSERT completes
        updateDept(dept);
        init();
      }
    );
}

function updateDept(dept) {
    console.log('Updating new department data...\n');
    const query = connection.query(
    'UPDATE employees SET ? WHERE ?',
    [
        {
            name: `${dept}`,
        },
    ],
    (err, res) => {
        if (err) throw err;
        console.log(`${res.affectedRows} department table updated!\n`);
        // Call deleteProduct AFTER the UPDATE completes
    }
    );
}
  


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




// Connect to the DB
connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  init();
});
