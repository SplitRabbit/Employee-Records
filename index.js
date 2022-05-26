const inquirer = require('inquirer');
const cTable = require('console.table');

//require server packages
const express = require('express');
const mysql = require('mysql2');
const { exit } = require('process');

const PORT = process.env.PORT || 3001;
const app = express();

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: '',
      database: 'company'
    },
    console.log('Connected to the company database.')
  );

//list of manager questions for inquirer
const questions = [
    {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "Add a Department",
            "Add a Role",
            "Add an Employee",
            "Update an Employee Role"
        ]
    },
    //conditional questions depending on role
    {
        type: "input",
        name: "newdepartment",
        message: "What is the department name?",
        when: (answers) => answers.action === "Add a Department"
    },
    {
        type: "input",
        name: "newrolename",
        message: "What is the name of this role?",
        when: (answers) => answers.action ===  "Add a Role"
    },
    {
        type: "input",
        name: "newrolesalary",
        message: "What is the salary for this role?",
        when: (answers) => answers.action ===  "Add a Role"
    },
    {
        type: "input",
        name: "newroledeparmentid",
        message: "What is the department for this role?",
        when: (answers) => answers.action ===  "Add a Role"
    },
    {
        type: "input",
        name: "newemployeefirstname",
        message: "What is their first name?",
        when: (answers) => answers.action === "Add an Employee"
    },
    {
        type: "input",
        name: "newemployeelastname",
        message: "What is their last name?",
        when: (answers) => answers.action === "Add an Employee"
    },
    {
        type: "input",
        name: "newemployeerole",
        message: "What is their role?",
        when: (answers) => answers.action === "Add an Employee"
    },
    {
        type: "input",
        name: "newemployeemanager",
        message: "Who is their manager?",
        when: (answers) => answers.action === "Add an Employee"
    },
    {
        type: "input",
        name: "updateemployeerole",
        message: "What is their new role?",
        when: (answers) => answers.action === "Update an Employee Role"
    },
];

//promptuser function
function promptUser() {
    console.log("Enter Employee Information Here.");
    inquirer.prompt(questions).then((answers) => {
        console.log(answers)
        if (answers.action === "View All Departments") {
            db.query(`SELECT * FROM department`, (err, rows) => {
                console.table(rows);
              });
        } else if (answers.action === "View All Roles") {
            db.query(`SELECT * FROM role`, (err, rows) => {
                console.table(rows);
              });
        } else if (answers.action === "View All Employees") {
            db.query(`SELECT * FROM employees`, (err, rows) => {
                console.table(rows);
              });
        } else if (answers.action === "Add a Department") {
            db.query(`INSERT INTO department (name) 
                        VALUES (${answers.newdepartment});`
                        , (err, rows) => {
                console.log(rows);
              });
        } else if (answers.action === "Add a Role") {
            db.query(`INSERT INTO role (title,salary,department_id)
                        VALUES (${answers.newrolename},${answers.newrolesalary},
                            (SELECT id FROM department WHERE name = ${answers.newroledeparment});`
                        , (err, rows) => {
                console.log('Role added successfully!')
              });
        } else if (answers.action === "Add an Employee") {
            db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id)
                        VALUES (${answers.newemployeefirstname},${answers.newemployeelastname},
                            (SELECT MAX(id) FROM role WHERE name = ${answers.newemployeerole}),
                            (SELECT MAX(id) FROM employees WHERE name = ${answers.newemployeemanager});`
                        , (err, rows) => {
                console.log('Employee updated successfully!')
              });
        } else if (answers.action ===  "Update an Employee Role") {
            db.query(`UPDATE employees 
                        SET role = (SELECT MAX(id) FROM role WHERE id = ${answers.updateemployeerole})`
                        , (err, rows) => {
                console.log('Employee updated successfully!')
              });
        } else {
            console.log("Not a Valid Action")
        };
    //recursive function to decide whether or not to loop through again
        dosomethingelse();
    });
};

function dosomethingelse() {
    return inquirer.prompt([{
        type: "confirm",
        name: "dosomethingelse",
        message: "Would you like to do something else?"
    }]).then((answers) => {
        if (answers.dosomethingelse) {
            promptUser();
        } else {
            exit();
        }
        promptUser()
    });
    //recursive question to reloop through questions 
};

promptUser();


// // Express middleware
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// // Default response for any other request (Not Found)
// app.use((req, res) => {
//   res.status(404).end();
// });




  
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });