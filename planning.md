backend
- jwt token authentication which will give user info when user login 
- each jwt token will have life of 24hr
- api user where they can register and login
- api application where they can add,edit,change status,delete application
- api note to add,edit, clear note
- bcrypt for password hashing


frontend 
- login/register page
- dashboard will have jobs applied to , interview, accepted, rejected columns
- top will have add and user icon
- clicking on add will create a form for job application applied
- clicking on the job applied card will give popup to check the apllication , edit it or delete , you can add note on each phase of the application 


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