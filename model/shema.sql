DROP DATABASE IF EXISTS company_hw;
CREATE database company_hw;

USE company_hw;

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT,
  department VARCHAR(30) NOT NULL,
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

CREATE TABLE managers (
  id INT AUTO_INCREMENT NOT NULL,
  manager_first_name VARCHAR(30) NOT NULL,
  manager_last_name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);