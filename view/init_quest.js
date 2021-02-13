const inquirer = require("inquirer");

// initial questions
const mainMenu = [
    {
        type: "list",
        message: "What would you like to do?",
        choices: ["View All Employees", "View Managers", "View Departments", "View Roles", "Add Manager", "Add Employee", "Add Department", "Add Role", "Update Employee", "Quit Application"],
        name: "initPrompt"
    }
];

module.exports = mainMenu;