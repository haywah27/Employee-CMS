INSERT INTO departments (department)
VALUES ("Sales");

INSERT INTO departments (department)
VALUES ("Engineering");

INSERT INTO departments (department)
VALUES ("Finance");

INSERT INTO departments (department)
VALUES ("Legal");

-- ////////////////////////////////////////////////////////////////////

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", 100000.00, 1);

INSERT INTO roles (title, salary, department_id)
VALUES ("Salesperson", 80000.00, 1);

INSERT INTO roles (title, salary, department_id)
VALUES ("Lead Engineer", 150000.00, 2);

INSERT INTO roles (title, salary, department_id)
VALUES ("Software Engineer", 120000.00, 2);

INSERT INTO roles (title, salary, department_id)
VALUES ("Accountant", 125000.00, 3);

INSERT INTO roles (title, salary, department_id)
VALUES ("Legal Team Lead", 250000.00, 4);

INSERT INTO roles (title, salary, department_id)
VALUES ("Lawyer", 190000.00, 4);

-- ////////////////////////////////////////////////////////////////////

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Bobby", "Wright", 2, 2);

INSERT INTO employees (first_name, last_name, role_id)
VALUES ("Billie", "Thudds", 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Theo", "Frames", 7, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Chloe", "Bosch", 4, 1);

INSERT INTO employees (first_name, last_name, role_id)
VALUES ("Hayley", "Wahlroos", 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Bonnie", "Muenster", 4, 1);

INSERT INTO employees (first_name, last_name, role_id)
VALUES ("Aspen", "Threads", 6);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Oscar", "Boots", 7, 3);

-- ////////////////////////////////////////////////////////////////////

INSERT INTO managers (manager_first_name, manager_last_name)
VALUES ("Hayley", "Wahlroos");

INSERT INTO managers (manager_first_name, manager_last_name)
VALUES ("Billie", "Thudds");

INSERT INTO managers (manager_first_name, manager_last_name)
VALUES ("Aspen", "Threads");

-- ////////////////////////////////////////////////////////////////////

-- show roles table with department name instead of ID
SELECT roles.id, roles.title, roles.salary, departments.department FROM roles INNER JOIN departments ON departments.id = roles.department_id;

-- show employees with roles and department names instead of ID numbers
SELECT employees.id AS ID, CONCAT(employees.first_name," ", employees.last_name) AS Employee, roles.title, departments.department, roles.salary, CONCAT(managers.manager_first_name," ", managers.manager_last_name) AS Manager
FROM employees INNER JOIN roles ON roles.id = employees.role_id
INNER JOIN departments ON departments.id = roles.department_id
LEFT JOIN managers ON managers.id = employees.manager_id;

