const mysql = require('mysql');
const inquirer = require("inquirer");
const cTable = require('console.table');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
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


let roleArr = [];
function readRoles() {
    console.log('Selecting titles roles...\n');
    connection.query('SELECT title FROM roles', (err, res) => {
        if (err) throw err;

        const roles = res.map(function(item){
            return item['title']
        });

        for (let i = 0; i < roles.length; i++){
            roleArr.push(roles[i]);
        }
        // console.log("role.arr", roleArr)
        return roleArr;

    });
};



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
                case ("Add Department"):
                    addDepartment();
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const viewEmployees = () => {
  console.log('Selecting all employees...\n');
  connection.query('SELECT employees.id AS ID, CONCAT(employees.first_name," ", employees.last_name) AS Employee, roles.title AS Title, departments.department AS Department, roles.salary AS Salary, CONCAT(managers.manager_first_name," ", managers.manager_last_name) AS Manager FROM employees INNER JOIN roles ON roles.id = employees.role_id INNER JOIN departments ON departments.id = roles.department_id LEFT JOIN managers ON managers.id = employees.manager_id', (err, res) => {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log("///////////////////////////////////////////////////////////////////////////////////////");
    console.table("\n", res);
    console.log("///////////////////////////////////////////////////////////////////////////////////////");
    init();
  });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const viewDepartments = () => {
    console.log('Selecting all departments...\n');
    connection.query('SELECT * FROM departments', (err, res) => {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log("///////////////////////////////////////////////////////////////////////////////////////");
      console.table("\n", res);
      console.log("///////////////////////////////////////////////////////////////////////////////////////");
      init();
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const viewRoles = () => {
    console.log('Selecting all roles...\n');
    connection.query('SELECT roles.id, roles.title, roles.salary, departments.department FROM roles INNER JOIN departments ON departments.id = roles.department_id;', (err, res) => {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log("///////////////////////////////////////////////////////////////////////////////////////");
      console.table("\n", res);
      console.log("///////////////////////////////////////////////////////////////////////////////////////");
      
      init();
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let depIDArr = 0;
function addEmployee(){
    readRoles();

    inquirer.prompt([{
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
        choices: roleArr,
        name: "role",
      },
      {
        type: "list",
        message: "Who is their manager?",
        choices: ["None", "Hayley Wahlroos", "Billie Thudds", "Aspen Threads",],
        name: "manager"
      }]).then(
        response => {
            
            console.log(response);
            const firstName = response.firstName;
            const lastName = response.lastName;
            let roleID = response.role;
            let managerID = response.manager;
            console.log(typeof managerID)
            converRoleToNum(roleID, depIDArr);

            function converRoleToNum(roleID, depIDArr){
                connection.query(("SELECT * FROM roles WHERE title = " + "'" + roleID + "'"), (err, res) => {
                    if (err) throw err;
                    let roleValueToDeptID = JSON.parse(JSON.stringify(res));
            
                    depIDArr = roleValueToDeptID[0].department_id;
            
                    console.log("he", depIDArr)

                    if (managerID === "Hayley Wahlroos"){
                        managerID = 1;
                    } else if (managerID === "Billie Frames"){
                        managerID = 2;
                    } else if (managerID === "Aspen Threads"){
                        managerID = 3;
                    } else {
                        managerID = "NULL";
                    }
                    
                    createEmployee(firstName, lastName, depIDArr, managerID);
              });
            }
            
            

            console.log("man ID", managerID)
            init();
        });
}


const createEmployee = (firstName, lastName, depIDArr, managerID) => {
    console.log('Inserting a new employee...\n');
    // if (managerID === "NULL"){

    //     connection.query('INSERT INTO employees SET ?',
    //     {
    //       first_name: `${firstName}`,
    //       last_name: `${lastName}`,
    //       role_id: `${depIDArr}`,
    //     },
    //     (err, res) => {
    //       if (err) throw err;
    //       console.log(`${res.affectedRows} employee inserted!\n`);
    //       // Call updateProduct AFTER the INSERT completes
    //     //   updateEmployee(firstName, lastName, depIDArr, managerID);
    //       init();
    //     }
    //   );
  
    // } else {
    
    connection.query('INSERT INTO employees SET ?',
      {
        first_name: `${firstName}`,
        last_name: `${lastName}`,
        role_id: `${depIDArr}`,
        manager_id: `${managerID}`,
      },
      (err, res) => {
        if (err) throw err;
        console.log(`${res.affectedRows} employee inserted!\n`);
        // Call updateProduct AFTER the INSERT completes
        init();
      }
    );
    // }
    // logs the actual query being run
    // console.log(query.sql);
  };


        // updateEmployee(firstName, lastName, depIDArr, managerID);

// const updateEmployee = (firstName, lastName, depIDArr, managerID) => {
//     console.log('Updating new employee data...\n');
//     const query = connection.query(
//     'UPDATE employees SET ? WHERE ?',
//     [
//         {
//             first_name: `${firstName}`,
//         },
//         {
//             last_name: `${lastName}`,
//         },
//         {
//             role_ID: `${depIDArr}`,
//         },
//         {
//             manager_ID: `${managerID}`,
//         },
//     ],
//     (err, res) => {
//         if (err) throw err;
//         console.log(`${res.affectedRows} employee table updated!\n`);
//         // Call deleteProduct AFTER the UPDATE completes
//     }
//     );

//     // logs the actual query being run
//     console.log(query.sql);
// };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addDepartment(){
    inquirer.prompt([
        {
            type: "input",
            message: "What department would you like to add?",
            name: "newDepartment"
        }
    ]).then(
        response => {
            console.log(response);
            const dept = response.newDepartment;

            createDept(dept);
            // console.log(response.newDepartment);

        });
}

function createDept(dept) {
    console.log('Inserting a new department...\n');

    connection.query('INSERT INTO departments SET ?',
      {
        department: `${dept}`,
      },
      (err, res) => {
        if (err) throw err;
        console.log(`${res.affectedRows} department inserted!\n`);
        // Call updateProduct AFTER the INSERT completes
        // updateDept(dept);
        init();
      }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let deptArr = [];
function readDepts() {
    console.log('Selecting department names...\n');
    connection.query('SELECT department FROM departments', (err, res) => {
        if (err) throw err;

        const depts = res.map(function(item){
            return item['department']
        });

        for (let i = 0; i < depts.length; i++){
            deptArr.push(depts[i]);
        }
    });
};


function addRole(){
    readDepts();
    inquirer.prompt(
    [
        {
            type: "input",
            message: "What role would you like to add?",
            name: "newRole"
        },
        {
            type: "input",
            message: "What salary does this role earn?",
            name: "newSalary"
        },
        {
            type: "list",
            message: "What department does this role belong to?",
            choices: deptArr,
            name: "roleDeptID"
        }

    ]).then(
        response => {
            
            console.log(response);
            const roleTitle = response.newRole;
            const roleSalary = response.newSalary;
            let roleID = response.roleDeptID;
            findDeptID(roleID, depIDArr);

            function findDeptID(roleID, depIDArr){
                connection.query(("SELECT * FROM departments WHERE department = " + "'" + roleID + "'"), (err, res) => {
                    if (err) throw err;
                    let roleValueToDeptID = JSON.parse(JSON.stringify(res));
            
                    depIDArr = roleValueToDeptID[0].id;
            
                    console.log("he", depIDArr)
                    createRole(roleTitle, roleSalary, depIDArr);
              });
            }
            
            init();
        });
}

function createRole(roleTitle, roleSalary, depIDArr) {
    console.log('Inserting a new role...\n');

    connection.query('INSERT INTO roles SET ?',
        {
            title: `${roleTitle}`,
            salary: `${roleSalary}`,
            department_id: `${depIDArr}`,
        },
      (err, res) => {
        if (err) throw err;
        console.log(`${res.affectedRows} role inserted!\n`);
        // Call updateProduct AFTER the INSERT completes
        // updateDept(dept);

        // push to roleArr
        init();
      }
    );
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// function readEmployees(){
//     console.log('Selecting employee names...\n');
//     connection.query('SELECT first_name FROM employees', (err, res) => {
//         if (err) throw err;

//         const empFirst = res.map(function(item){
//             return item['first_name']
//         });

//         for (let i = 0; i < empFirst.length; i++){
//             empArr.push(empFirst[i]);
//         }

//         return empArr;

//     });
// };

let employeeArr = [];
function readEmployees(){
        
    console.log('Selecting employee names...\n');
    connection.query('SELECT CONCAT(first_name," ", last_name) AS Manager FROM employees', (err, res) => {
        if (err) throw err;

        const empFirst = res.map(function(item){
            return item['Manager']
        });
        
        for (let i = 0; i < empFirst.length; i++){
            // test.push(empFirst[i]);
            employeeArr.push(empFirst[i])
            
        }
        console.log("employee.arr", employeeArr)

        readRoles();
        inquirer.prompt(
            [
                {
                    type: "list",
                    message: "Which employee would you like to edit?",
                    choices: employeeArr,
                    name: "editName",
                },
                {
                    type: "list",
                    message: "Which role are they moving to?",
                    choices: roleArr,
                    name: "editRole",
                }
                
            ])
    });
};

function updateEmployee(){
   
    readEmployees();
    readRoles();
    inquirer.prompt(
    [
        {
            type: "list",
            message: "Which employee would you like to edit?",
            choices: employeeArr,
            name: "editName",
        },
        {
            type: "list",
            message: "Which role are they moving to?",
            choices: roleArr,
            name: "editRole",
        }
        
    ])
.then(
        response => {

            console.log(response);
            const editName1 = response.editName;
            let roleID = response.editRole;
            findDeptID(roleID, depIDArr);

            function findDeptID(roleID, depIDArr){
                connection.query(("SELECT * FROM roles WHERE title = " + "'" + roleID + "'"), (err, res) => {
                    if (err) throw err;
                    let roleValueToDeptID = JSON.parse(JSON.stringify(res));
            
                    depIDArr = roleValueToDeptID[0].id;
            
                    console.log("dep ID", depIDArr)
                    editRole(editName1, depIDArr);
              });
            }
            
            init();
        });
 
}


function editRole(editName1, depIDArr){
    console.log('Updating employee...\n');
    let split = editName1.split(" ");
    firstNameSplit = split[0];
    lastNameSplit = split[1];
    console.log("first name", firstNameSplit)
    console.log("last name", lastNameSplit)
    connection.query(
      'UPDATE employees SET ? WHERE first_name = ' + "'" + firstNameSplit + "'" + "AND last_name = " + "'" + lastNameSplit + "'",
      [
        {
            role_id: `${depIDArr}`,
        },
      ],
      (err, res) => {
        if (err) throw err;
        console.log(`${res.affectedRows} employee updated!\n`);
      }
    ); 
}

// const updateDept = (dept)  => {
//     console.log('Updating new department data...\n');
//     const query = connection.query(
//     'UPDATE departments SET ?',
//     [
//         {
//             department: `${dept}`,
//         },
//     ],
//     (err, res) => {
//         if (err) throw err;
//         console.log(`${res.affectedRows} department table updated!\n`);
//         // Call deleteProduct AFTER the UPDATE completes
//     }
//     );
// }
  

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
