
const inquirer = require("inquirer");
const cTable = require('console.table');
const connection = require('./model/connection');
const mainMenu = require('./view/init_quest');
const read_DB = require('./model/readDB');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// setting global variables

let roleArr = [];
let deptID = 0;
let deptArr = [];
let manID = 0;
let employeeArr = [];
let managerArr = ["None"];

const brkLines = "///////////////////////////////////////////////////////////////////////////////////////\n"

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
    connection.query('SELECT CONCAT(first_name," ", last_name) AS Employee FROM employees', (err, res) => {
        if (err) throw err;

        const empFirst = res.map(function(item){
            return item['Employee']
        });
        
        for (let i = 0; i < empFirst.length; i++){
            employeeArr.push(empFirst[i]) 
        }
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// read manager table

function readManagers(){
    managerArr = ["None"];
    connection.query('SELECT CONCAT(manager_first_name," ", manager_last_name) AS Manager FROM managers', (err, res) => {
        if (err) throw err;

        const manName = res.map(function(item){
            return item['Manager']
        });
        
        for (let i = 0; i < manName.length; i++){
            managerArr.push(manName[i]) 
        }
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// main menu

function init(){
    readEmployees();
    readRoles();
    readDepts();
    readManagers();
    
    inquirer.prompt(mainMenu).then(
        response => {
            switch (response.initPrompt) {
                case ("View All Employees"):
                    viewEmployees();
                    break;
                case ("View Managers"):
                    viewManagers();
                    break;
                case ("View Departments"):
                    viewDepartments();
                    break;
                case ("View Roles"):
                    viewRoles();
                    break;
                case ("Add Manager"):
                    addManager();
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

// view mqnqgers

const viewManagers = () => {
    connection.query(read_DB.viewMangrs, (err, res) => {
      if (err) throw err;
      console.log(brkLines);
      console.table("\nManagers", res);
      console.log(brkLines);

      init();
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// view employees

const viewEmployees = () => {
    connection.query(read_DB.viewEmployees, (err, res) => {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(brkLines);
        console.table("\nEmployees", res);
        console.log(brkLines);
        init();
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// view departments

const viewDepartments = () => {
    connection.query(read_DB.viewDepts, (err, res) => {
      if (err) throw err;
      console.log(brkLines);
      console.table("\nDepartments", res);
      console.log(brkLines);

      init();
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// view roles

const viewRoles = () => {
    connection.query(read_DB.viewRoles, (err, res) => {
      if (err) throw err;
      console.log(brkLines);
      console.table("\nRoles", res);
      console.log(brkLines);
      
      init();
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// create new employee

// get information about employee
// function addEmployee(){
//     deptID = 0;
//     manID = 0;

//     inquirer.prompt([{
//         type: "input",
//         message: "What is their first name?",
//         name: "firstName",
//       },
//       {
//         type: "input",
//         message: "What is their last name?",
//         name: "lastName",
//       },
//       {
//         type: "list",
//         message: "What is their role?",
//         choices: roleArr,
//         name: "role",
//       },
//       {
//         type: "list",
//         message: "Who is their manager?",
//         choices: managerArr,
//         name: "manager"
//       }]).then(
//         response => {
//             const firstName = response.firstName;
//             const lastName = response.lastName;
//             let roleID = response.role;
//             let managerID = response.manager;
//             console.log("man id", managerID)
//             convertRoleToNum(roleID, deptID);

//             function convertRoleToNum(roleID, deptID){
//                 connection.query(`SELECT * FROM roles WHERE title = "${roleID}"`, (err, res) => {
//                     if (err) throw err;
//                     let roleValueToDeptID = JSON.parse(JSON.stringify(res));

//                     deptID = roleValueToDeptID[0].id; 

                    
//                     // console.log("man arr", manID)
                    
//                     console.log("dep arr", deptID)
//                 // createEmployee(firstName, lastName, deptID, manID);
//                 convertManToID(managerID, manID, deptID)
//                 init(); 
//               })
              
//             } 
            
//             function convertManToID(managerID, manID, deptID) {
//                 if(managerID === "None"){
//                     manID = "NULL";
//                     createEmployee(firstName, lastName, deptID, manID);

//                 } else {

//                 let splitMan = managerID.split(" ");
//                 firstNameMan = splitMan[0];
//                 lastNameMan = splitMan[1];

//                 connection.query(`SELECT * FROM managers WHERE manager_first_name = "${firstNameMan}" AND manager_last_name = "${lastNameMan}"`, (err, res) => {
//                     if (err) throw err;
                    
//                     let manValueToManID = JSON.parse(JSON.stringify(res));
//                     manID = manValueToManID[0].id;
//                     createEmployee(firstName, lastName, deptID, manID);
//                 })
//             } 
                
//             }
           
//         });
// }

// // push information to mysql table
// const createEmployee = (firstName, lastName, deptID, manID) => {
//     if (manID === "NULL"){
//         connection.query('INSERT INTO employees SET ?',
//         {
//           first_name: `${firstName}`,
//           last_name: `${lastName}`,
//           role_id: `${deptID}`,
//         },
//         (err, res) => {
//           if (err) throw err;
//           console.log(`${res.affectedRows} employee inserted!\n`);  
//         }
//       );
  
//     } else {
//         connection.query('INSERT INTO employees SET ?',
//         {
//             first_name: `${firstName}`,
//             last_name: `${lastName}`,
//             role_id: `${deptID}`,
//             manager_id: `${manID}`,
//         },
//         (err, res) => {
//             if (err) throw err;
//             console.log(`${res.affectedRows} employee inserted!\n`);
//         }
//     )};
//   };


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

            console.log("\n", brkLines);
            console.log(`New Department added!\n`);
            init()
        });
        
}

// // push data into mysql table
function createDept(dept) {
    connection.query('INSERT INTO departments SET ?',
      {
        department: `${dept}`,
      },
      (err, res) => {
        if (err) throw err; 
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
            findDeptID(roleID, deptID);

            function findDeptID(roleID, deptID){
                connection.query(`SELECT * FROM departments WHERE department = "${roleID}"`, (err, res) => {
                    if (err) throw err;
                    let roleValueToDeptID = JSON.parse(JSON.stringify(res));
                    deptID = roleValueToDeptID[0].id;
                    createRole(roleTitle, roleSalary, deptID);
              });
            }

            console.log("\n", brkLines);
            console.log(`New Role added!\n`);
            init();
        });
}

// push role data to mysql table
function createRole(roleTitle, roleSalary, deptID) {
    connection.query('INSERT INTO roles SET ?',
        {
            title: `${roleTitle}`,
            salary: `${roleSalary}`,
            department_id: `${deptID}`,
        },
      (err, res) => {
        if (err) throw err;
      }
    );
    
    
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addManager(){
    inquirer.prompt([
        {
            type: "input",
            message: "What is the first name of the new manager?",
            name: "newManagerFirst"
        },
        {
            type: "input",
            message: "What is the last name of the new manager?",
            name: "newManagerLast"
        }
    ]).then(
        response => {

            const mangrFirst = response.newManagerFirst;
            const mangrLast = response.newManagerLast;
            
            createMangr(mangrFirst, mangrLast);
            
            console.log("\n", brkLines);
            console.log(`New manager added!\n`);
            init();
        });
}

// push data into mysql table
function createMangr(mangrFirst, mangrLast) {
    connection.query('INSERT INTO managers SET ?',
      {
        manager_first_name: `${mangrFirst}`,
        manager_last_name: `${mangrLast}`,
      },
      (err, res) => {
        if (err) throw err;
      }
    );
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// update employee 

// get new employee role and/ or manager data
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
                message: "What do they need updated?",
                choices: ["Role", "Manager", "Both"],
                name: "updateChoice",
            },
            
        ]) 
    .then(
        response => {

            const editName1 = response.editName;
            let choice = response.updateChoice;

            if (choice === "Role"){
                inquirer.prompt(
                    [
                        {
                            type: "list",
                            message: "Which role are they moving to?",
                            choices: roleArr,
                            name: "editRole",
                        },  
                    ]) 
                .then(
                    response => {
                        let roleID = response.editRole;
                        findDeptID(roleID, deptID);
            
                        function findDeptID(roleID, deptID){
                            connection.query(`SELECT * FROM roles WHERE title = "${roleID}"`, (err, res) => {
                                if (err) throw err;
                                let roleValueToDeptID = JSON.parse(JSON.stringify(res));
                                deptID = roleValueToDeptID[0].id;
                                editRole(editName1, deptID)
                                console.log("\n", brkLines);
                                console.log(`${editName1} has been updated!\n`);
                                init();
                          });
                        }   
                    });

            } else if (choice === "Manager"){
                inquirer.prompt([
                  {
                    type: "list",
                    message: "Who is their manager?",
                    choices: managerArr,
                    name: "manager"
                  }
                ]).then(
                    response => {
                        let managerID = response.manager;
                        updateManager(managerID, manID);

                        function updateManager(managerID, manID) {
                            if(managerID === "None"){
                                manID = "NULL";
                                editManage(editName1, manID);
                                console.log("\n", brkLines);
                                console.log(`${editName1} updated!\n`);
                                init();           
                            } else {
            
                            let splitMan = managerID.split(" ");
                            firstNameMan = splitMan[0];
                            lastNameMan = splitMan[1];
            
                            connection.query(`SELECT * FROM managers WHERE manager_first_name = "${firstNameMan}" AND manager_last_name = "${lastNameMan}"`, (err, res) => {
                                if (err) throw err;
                                
                                let manValueToManID = JSON.parse(JSON.stringify(res));
                                manID = manValueToManID[0].id;
                                editManage(editName1, manID);
                                console.log("\n", brkLines);
                                console.log(`${editName1} has been updated!\n`);        
                                init();                 
                            })
                        } 
                            
                        } 
                    }
                )

            } else if (choice === "Both"){
                
                inquirer.prompt(
                    [
                        {
                            type: "list",
                            message: "Which role are they moving to?",
                            choices: roleArr,
                            name: "editRole",
                        }, 
                        {
                            type: "list",
                            message: "Who is their manager?",
                            choices: managerArr,
                            name: "manager"
                          } 
                    ]) 
                .then(
                    response => {
                        let roleID = response.editRole;
                        let managerID = response.manager;
                        updateManager(managerID, manID);
                        findDeptID(roleID, deptID);
            
                        function findDeptID(roleID, deptID){
                            connection.query(`SELECT * FROM roles WHERE title = "${roleID}"`, (err, res) => {
                                if (err) throw err;
                                let roleValueToDeptID = JSON.parse(JSON.stringify(res));
                                deptID = roleValueToDeptID[0].id;
                                editRole(editName1, deptID);

                                console.log("\n", brkLines);
                                console.log(`${editName1} has been updated!\n`);
                                init();
                          });
                        }   
                    });

                    function updateManager(managerID, manID) {
                        if(managerID === "None"){
                            manID = "NULL";
                            editManage(editName1, manID);
                                       
                        } else {
        
                        let splitMan = managerID.split(" ");
                        firstNameMan = splitMan[0];
                        lastNameMan = splitMan[1];
        
                        connection.query(`SELECT * FROM managers WHERE manager_first_name = "${firstNameMan}" AND manager_last_name = "${lastNameMan}"`, (err, res) => {
                            if (err) throw err;
                            
                            let manValueToManID = JSON.parse(JSON.stringify(res));
                            manID = manValueToManID[0].id;
                            editManage(editName1, manID);                         
                        })
                    } 
                        
                    } 

            } else {
                console.log("\n", brkLines);
                console.log("404 something went wrong, please try again");
                init();
            }
    
        });
}

// push new update to mysql table
function editRole(editName1, deptID){
    let split = editName1.split(" ");
    firstNameSplit = split[0];
    lastNameSplit = split[1];
    connection.query(
      `UPDATE employees SET ? WHERE first_name = "${firstNameSplit}" AND last_name = "${lastNameSplit}"`,
      [
        {
            role_id: `${deptID}`,
        },
      ],
      (err, res) => {
        if (err) throw err;
      }
    ); 
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function editManage(editName1, manID) {
    let split = editName1.split(" ");
    firstNameSplit = split[0];
    lastNameSplit = split[1];
    connection.query(
      `UPDATE employees SET ? WHERE first_name = "${firstNameSplit}" AND last_name = "${lastNameSplit}"`,
      [
        {
            manager_id: `${manID}`,
        },
      ],
      (err, res) => {
        if (err) throw err;
      }
    ); 
}

// update managers
// view by manager
// delete
// view budget per department (salries combined)


function displayByManager(){

}


// Connect to the DB
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected to mysql server as id ${connection.threadId}\n`);
    init();
  });