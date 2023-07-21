import EmployeeOrgApp from "./Classes/EmployeeOrgApp"
import  Employee  from "./Interfaces/Employee";

const organizationStructure = [
    {
        "name": "John Smith",
        "uniqueId": 1,
        "supervisorId": null
    },
    {
        "name": "Margot Donald",
        "uniqueId": 2,
        "supervisorId": 1
    },
    {
        "name": "Cassandra Reynolds",
        "uniqueId": 6,
        "supervisorId": 2
    },
    {
        "name": "Mary Blue",
        "uniqueId": 7,
        "supervisorId": 6
    },
    {
        "name": "Bob Saget",
        "uniqueId": 8,
        "supervisorId": 6
    },
    {
        "name": "Tina Teff",
        "uniqueId": 9,
        "supervisorId": 8
    },
    {
        "name": "Will Turner",
        "uniqueId": 10,
        "supervisorId": 9
    },
    {
        "name": "Tyler Simpson",
        "uniqueId": 3,
        "supervisorId": 1
    },
    {
        "name": "Harry Tobs",
        "uniqueId": 11,
        "supervisorId": 3
    },
    {
        "name": "Thomas Brown",
        "uniqueId": 12,
        "supervisorId": 11
    },
    {
        "name": "George Carrey",
        "uniqueId": 13,
        "supervisorId": 3
    },
    {
        "name": "Gary Styles",
        "uniqueId": 14,
        "supervisorId": 3
    },
    {
        "name": "Ben Willis",
        "uniqueId": 4,
        "supervisorId": 1
    },
    {
        "name": "Georgina Flangy",
        "uniqueId": 5,
        "supervisorId": 1
    },
    {
        "name": "Sophie Turner",
        "uniqueId": 15,
        "supervisorId": 5
    }
]


const main = () => {

    //creating and adding the ceo
    const ceo: Employee = {
        name: organizationStructure[0].name,
        uniqueId: organizationStructure[0].uniqueId,
        subordinates: []
    };

    const app = new EmployeeOrgApp(ceo)


    // adding other employees
    let otherSubordinates = [...organizationStructure];
    otherSubordinates.shift()
    otherSubordinates.forEach(employee => {
        const newEmployee = { name: employee.name, uniqueId: employee.uniqueId, subordinates: [] }
        if (employee.supervisorId) {
            app.addSubOrdinates(employee.supervisorId, newEmployee)
        }

    })

    console.log("\n \n Original Structure:")
    app.displayEmployee(0)

    // Move an employee with ID 6 (Cassandra Reynolds) to be subordinate of employee with ID 14 (Gary Styles).
    app.move(8, 5);
  
    console.log("\n \n Moved Employees, Current Structure: ")
    app.displayEmployee(0)

    // Undo the last move action
    app.undo();

    console.log("\n \n Undo Changes, Current Structure: ")
    app.displayEmployee(0)

    // Redo the last undone action
    app.redo();

    console.log("\n \n Redo Changes, Current Structure: ")
    app.displayEmployee(0)
}

main();