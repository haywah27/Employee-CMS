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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// initial questions

const initialPrompt = [
    {
        type: "list",
        message: "Would you like to do?",
        choices: ["View All Employees", "View Departments", "View Roles", "Add Employee", "Add Department", "Add Role", "Update Employee", "Quit Application"],
        name: "initPrompt"
    }
];

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// setting global variables

let roleArr = [];
let depIDArr = 0;
let deptArr = [];
let employeeArr = [];

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// read role table

function readRoles() {
    connection.query('SELECT title FROM roles', (err, res) => {
        if (err) throw err;

        const roles = res.map(function(item){
            return item['title']
        });

        for (let i = 0; i < roles.length; i++){
            roleArr.push(roles[i]);
        }

    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// read department table

function readDepts() {
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// read employee table

function readEmployees(){
    connection.query('SELECT CONCAT(first_name," ", last_name) AS Manager FROM employees', (err, res) => {
        if (err) throw err;

        const empFirst = res.map(function(item){
            return item['Manager']
        });
        
        for (let i = 0; i < empFirst.length; i++){
            employeeArr.push(empFirst[i]) 
        }
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// main menu

function init(){
    readEmployees();
    readRoles();
    readDepts();
    
    inquirer.prompt(initialPrompt).then(
        response => {
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

// view employees

const viewEmployees = () => {
    connection.query('SELECT employees.id AS ID, CONCAT(employees.first_name," ", employees.last_name) AS Employee, roles.title AS Title, departments.department AS Department, roles.salary AS Salary, CONCAT(managers.manager_first_name," ", managers.manager_last_name) AS Manager FROM employees INNER JOIN roles ON roles.id = employees.role_id INNER JOIN departments ON departments.id = roles.department_id LEFT JOIN managers ON managers.id = employees.manager_id', (err, res) => {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log("///////////////////////////////////////////////////////////////////////////////////////");
        console.table("\nEmployees", res);
        console.log("///////////////////////////////////////////////////////////////////////////////////////\n");
        init();
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// view departments

const viewDepartments = () => {
    connection.query('SELECT * FROM departments', (err, res) => {
      if (err) throw err;
      console.log("///////////////////////////////////////////////////////////////////////////////////////");
      console.table("\nDepartments", res);
      console.log("///////////////////////////////////////////////////////////////////////////////////////\n");

      init();
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// view roles

const viewRoles = () => {
    connection.query('SELECT roles.id, roles.title, roles.salary, departments.department FROM roles INNER JOIN departments ON departments.id = roles.department_id;', (err, res) => {
      if (err) throw err;
      console.log("///////////////////////////////////////////////////////////////////////////////////////");
      console.table("\nRoles", res);
      console.log("///////////////////////////////////////////////////////////////////////////////////////\n");
      
      init();
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// create new employee

// get information about employee
function addEmployee(){
    depIDArr = 0;

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
            const firstName = response.firstName;
            const lastName = response.lastName;
            let roleID = response.role;
            let managerID = response.manager;

            converRoleToNum(roleID, depIDArr);

            function converRoleToNum(roleID, depIDArr){
                connection.query(("SELECT * FROM roles WHERE title = " + "'" + roleID + "'"), (err, res) => {
                    if (err) throw err;
                    let roleValueToDeptID = JSON.parse(JSON.stringify(res));
                    console.log("roleValue", roleValueToDeptID)
                    depIDArr = roleValueToDeptID[0].id;

                    if (managerID === "Hayley Wahlroos"){
                        managerID = 1;
                    } else if (managerID === "Billie Frames"){
                        managerID = 2;
                    } else if (managerID === "Aspen Threads"){å
                        managerID = 3;
                    } else {
                        managerID = "NULL";
                    }

                    createEmployee(firstName, lastName, depIDArr, managerID);
                    init();
              });
            }   
        });
}

// push information to mysql table
const createEmployee = (firstName, lastName, depIDArr, managerID) => {
    if (managerID === "NULL"){
        connection.query('INSERT INTO employees SET ?',
        {
          first_name: `${firstName}`,
          last_name: `${lastName}`,
          role_id: `${depIDArr}`,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} employee inserted!\n`);  
        }
      );
  
    } else {
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
        }
    )};
  };


////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// create new department

// get department data
function addDepartment(){
    inquirer.prompt([
        {
            type: "input",
            message: "What department would you like to add?",
            name: "newDepartment"
        }
    ]).then(
        response => {

            const dept = response.newDepartment;

            createDept(dept);
            init();
        });
}

// push data into mysql table
function createDept(dept) {
    connection.query('INSERT INTO departments SET ?',
      {
        department: `${dept}`,
      },
      (err, res) => {
        if (err) throw err;
        console.log(`${res.affectedRows} department inserted!\n`);
      }
    );
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// create new role

// get role data
function addRole(){
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
            const roleTitle = response.newRole;
            const roleSalary = response.newSalary;
            let roleID = response.roleDeptID;
            findDeptID(roleID, depIDArr);

            function findDeptID(roleID, depIDArr){
                connection.query(("SELECT * FROM departments WHERE department = " + "'" + roleID + "'"), (err, res) => {
                    if (err) throw err;
                    let roleValueToDeptID = JSON.parse(JSON.stringify(res));
                    depIDArr = roleValueToDeptID[0].id;
                    createRole(roleTitle, roleSalary, depIDArr);
              });
            }
            
            init();
        });
}

// push role data to mysql table
function createRole(roleTitle, roleSalary, depIDArr) {
    connection.query('INSERT INTO roles SET ?',
        {
            title: `${roleTitle}`,
            salary: `${roleSalary}`,
            department_id: `${depIDArr}`,
        },
      (err, res) => {
        if (err) throw err;
        console.log(`${res.affectedRows} role inserted!\n`);

      }
    );
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// update employee 

// get new employee role data
function updateEmployee(){

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
            const editName1 = response.editName;
            let roleID = response.editRole;
            findDeptID(roleID, depIDArr);

            function findDeptID(roleID, depIDArr){
                connection.query(("SELECT * FROM roles WHERE title = " + "'" + roleID + "'"), (err, res) => {
                    if (err) throw err;
                    let roleValueToDeptID = JSON.parse(JSON.stringify(res));
                    depIDArr = roleValueToDeptID[0].id;
                    editRole(editName1, depIDArr);
                    init();
              });
            }   
        });
}

// push new update to mysql table
function editRole(editName1, depIDArr){
    let split = editName1.split(" ");
    firstNameSplit = split[0];
    lastNameSplit = split[1];
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Connect to the DB
connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  
  init();
});
