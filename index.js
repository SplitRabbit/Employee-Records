const inquirer = require('inquirer');
const fs = require("fs");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);


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
        name: "newroledeparment",
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

    //recursive question to reloop through questions 
    {
        type: "confirm",
        name: "dosomethingelse",
        message: "Would you like to do something else?"
    },
];

//promptuser function
function promptUser() {
    console.log("Enter Employee Information Here.");
    return inquirer.prompt(questions).then((answers) => {
        console.log(answers)
    //recursive function to decide whether or not to loop through again
        if (answers.dosomethingelse) {
            return promptUser();
        } else {
            return answers;
        }
    });
};

promptUser();