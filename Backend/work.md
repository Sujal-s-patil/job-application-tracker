
mysql
- user (this table is for saving user information)
```sql
create table users(
    id int AUTO_INCREMENT,
    firstName varchar(200),
    lastName varchar(200),
    email varchar(200) not null unique,
    password varchar(200),
    primary key(id)
);
```

- application (this table is for application, added four field to write the note at each phase of the application)
```sql
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
```


1. create api for login/register
- login will get email and password from the user and will return jwt token with user payload
- register will get the firstname,lastName, email and the password 

1. create api for applications 
- get all applications created by the user
- add create application
- edit edit the current application
- delete , delete the current application
- change status of the application
- add note in application