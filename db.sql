-- Create Database
CREATE DATABASE fittrack_db;

-- Use Database
USE fittrack_db;

-- Users Table
CREATE TABLE users (
   id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  gender ENUM('Male', 'Female', 'Other') NOT NULL,
  height FLOAT NOT NULL,
  weight FLOAT NOT NULL,
  activity_level VARCHAR(50) NOT NULL,
  goal VARCHAR(100) NOT NULL,
  dob DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact Table
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL
);
