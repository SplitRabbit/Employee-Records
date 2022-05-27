const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');


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

  //main running function
function main() {
    promptUser();
}

//promptuser function
function promptUser() {
    inquirer.prompt([
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
        }]).then((answers) => {
        if (answers.action === "View All Departments") {
            viewdepartments();
        } else if (answers.action === "View All Roles") {
            viewroles();
        } else if (answers.action === "View All Employees") {
            viewemployees();
        } else if (answers.action === "Add a Department") {
            adddepartment();
        } else if (answers.action === "Add a Role") {
            addrole();
        } else if (answers.action === "Add an Employee") {
            addemployee();
        } else if (answers.action ===  "Update an Employee Role") {
            updateemployee();
        } else {
            console.log("Not a Valid Action")
        };
    });
};
function viewdepartments() {
    db.query(`SELECT * FROM department`, (error, rows) => {
        if (error){
            return console.error(error.message);
        }
        console.table(rows);
        dosomethingelse();
      });
};

function viewroles() {
    db.query(`SELECT * FROM role`, (error, rows) => {
        if (error){
            return console.error(error.message);
        }
        console.table(rows);
        dosomethingelse();
    });
};

function viewemployees() {
db.query(`SELECT * FROM employees`, (error, rows) => {
    if (error){
        return console.error(error.message);
    }
    console.table(rows);
    dosomethingelse();
  });
};

function adddepartment() {
    return inquirer.prompt ([{
            type: "input",
            name: "newdepartment",
            message: "What is the department name?",
            when: (answers) => answers.action === "Add a Department"
    }]).then((answers) => {
        db.query(`INSERT INTO department (name) 
        VALUES (${answers.newdepartment});`
        , (error, rows) => {
            if (error){
                return console.error(error.message);
            }
        console.log('Department Added Successfully!');
        dosomethingelse();
    });
    })
};

function addrole() {
    return inquirer.prompt ([{
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
    }]).then((answers) => {
        db.query(`INSERT INTO role (title,salary,department_id)
        VALUES (${answers.newrolename},${answers.newrolesalary},
            (SELECT id FROM department WHERE name = ${answers.newroledeparment});`
        , (error, rows) => {
            if (error){
                return console.error(error.message);
            }
        console.log('Role added successfully!');
        dosomethingelse();
        })
    });
    };

function addemployee() {
    return inquirer.prompt ([{
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
    }]).then((answers) => {
        db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES (${answers.newemployeefirstname},${answers.newemployeelastname},
            (SELECT MAX(id) FROM role WHERE name = ${answers.newemployeerole}),
            (SELECT MAX(id) FROM employees WHERE name = ${answers.newemployeemanager});`
        , (error, rows) => {
            if (error){
                return console.error(error.message);
            }
    console.log('Employee added successfully!');
    dosomethingelse();
        })
    });
};

function updateemployee() {
    return inquirer.prompt ([{
        type: "input",
        name: "updateemployeerole",
        message: "What is their new role?",
        when: (answers) => answers.action === "Update an Employee Role"
    }]).then((answers) => {
        db.query(`UPDATE employees 
        SET role = (SELECT MAX(id) FROM role WHERE id = ${answers.updateemployeerole})`
        , (error, rows) => {
            if (error){
                return console.error(error.message);
            }
    console.log('Employee updated successfully!');
    dosomethingelse();
        })
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
            process.exit();
        }
    });
};

main();