DROP DATABASE IF EXISTS company_hw;
CREATE database company_hw;

USE company_hw;

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE roles (
  id INT AUTO_INCREMENT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employees (
  id INT AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  PRIMARY KEY (id)

);

INSERT INTO departments (name)
VALUES ("Sales");

INSERT INTO departments (name)
VALUES ("Engineering");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Executive", 50000.00, 1);

INSERT INTO roles (title, salary, department_id)
VALUES ("Engineer", 100000.00, 2);

INSERT INTO employees (first_name, last_name, role_id)
VALUES ("Walrus", "Monster", 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Billie", "Farthead", 2, 1);

--  get all sales executives
SELECT * FROM employees WHERE role_id = 1;
--  infor that is shared between tables
SELECT * FROM roles
INNER JOIN employees
ON roles.id = employees.role_id


-- SELECT * FROM top5000;