const viewEmployees = 'SELECT employees.id AS ID, CONCAT(employees.first_name," ", employees.last_name) AS Employee, roles.title AS Title, departments.department AS Department, roles.salary AS Salary, CONCAT(managers.manager_first_name," ", managers.manager_last_name) AS Manager FROM employees INNER JOIN roles ON roles.id = employees.role_id INNER JOIN departments ON departments.id = roles.department_id LEFT JOIN managers ON managers.id = employees.manager_id';

const viewDepts = 'SELECT * FROM departments';

const viewRoles = 'SELECT roles.id, roles.title, roles.salary, departments.department FROM roles INNER JOIN departments ON departments.id = roles.department_id;';


module.exports = {
    viewEmployees,
    viewDepts,
    viewRoles
};