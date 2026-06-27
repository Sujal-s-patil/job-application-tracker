CREATE DATABASE IF NOT EXISTS JOB_APPLICATION_TRACKER;

USE JOB_APPLICATION_TRACKER;

create table users(
    id int AUTO_INCREMENT,
    firstName varchar(200) NOT NULL,
    lastName varchar(200)  NOT NULL,
    email varchar(200) NOT NULL unique,
    password varchar(200)  NOT NULL,
    primary key(id)
);

CREATE TABLE applications(
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    title VARCHAR(200),
    roleApplied VARCHAR(200),
    jobDescription TEXT,
    dateApplied DATETIME DEFAULT CURRENT_TIMESTAMP,
    applicationStatus ENUM("applied","interview","accepted","rejected") DEFAULT "applied",
    noteForApplied TEXT,
    noteForInterview TEXT,
    noteForAccepted TEXT,
    noteForRejected TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);