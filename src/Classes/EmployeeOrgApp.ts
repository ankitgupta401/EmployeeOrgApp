import Employee from "../Interfaces/Employee";
import IEmployeeOrgApp from "../Interfaces/IEmployeeOrgApp";

export default class EmployeeOrgApp implements IEmployeeOrgApp {
    private history: { employee: Employee; oldSupervisor: Employee }[] = [];
    private future: { supervisorId: number; employeeID: number }[] = [];

    constructor(public ceo: Employee) { }

    move(employeeID: number, supervisorID: number): void {
        const { employee, oldSupervisor } = this.findEmployeeAndOldSupervisor(employeeID);

        if (!employee || !oldSupervisor) {
            throw new Error("Employee not found or has no supervisor.");
        }

        const newSupervisor = this.findEmployee(supervisorID);
        if (!newSupervisor) {
            throw new Error("Supervisor not found.");
        }

        this.history.push({ oldSupervisor: this.deepClone(oldSupervisor), employee: this.deepClone(employee) });
        this.future.pop(); // pop the redo history

        oldSupervisor.subordinates = oldSupervisor.subordinates.filter((e) => e.uniqueId !== employeeID);
        oldSupervisor.subordinates = [...oldSupervisor.subordinates, ...employee.subordinates]
        employee.subordinates = [];
        // Store the action in history for undo/redo

        newSupervisor.subordinates.push(employee);


    }


    undo(): void {

        if (!this.history.length) {
            return;
        }
        const previousAction = this.history.pop();
        if (previousAction) {

            const { employee, oldSupervisor } = previousAction;

         
            if (!employee || !oldSupervisor) {
                throw new Error("Employee not found or has no supervisor.");
            }

            const currentSupervisor = this.findCurrentSupervisor(employee.uniqueId, this.ceo);
            if (currentSupervisor) {
                // Store the action in the redo history
                this.future.push({ employeeID: employee.uniqueId, supervisorId: currentSupervisor.uniqueId });
                currentSupervisor.subordinates = currentSupervisor.subordinates.filter(
                    (e) => e.uniqueId !== employee.uniqueId
                );

            }

            // reset the previous supervisor
            let currentOldSupervisor = this.findEmployee(oldSupervisor.uniqueId, this.ceo)

            if (currentOldSupervisor) {
                currentOldSupervisor.subordinates = oldSupervisor.subordinates;
            }
        }
    }

    redo(): void {
        if (!this.future.length) {
            return;
        }
        const futureAction = this.future.pop();
        if (futureAction) {

            this.move(futureAction.employeeID, futureAction.supervisorId)
        }
    }

    // Utility functions
    displayEmployee(level: number, employee: Employee = this.ceo): void {
        const indentation = "  ".repeat(level);

        console.log(`${indentation}- ${employee.name}`);

        for (const subordinate of employee.subordinates) {
            this.displayEmployee(level + 1, subordinate);
        }
    }


    addSubOrdinates(supervisorID: number, employee: Employee) {
        let supervisor: Employee | null = this.findEmployee(supervisorID)
        if (supervisor) {
            supervisor.subordinates.push(employee)
        }
    }

    private findEmployeeAndOldSupervisor(
        employeeID: number,
        currentEmployee: Employee = this.ceo
    ): { employee: Employee | null; oldSupervisor: Employee | null } {
        if (currentEmployee.uniqueId === employeeID) {
            return { employee: currentEmployee, oldSupervisor: null };
        }

        for (const subordinate of currentEmployee.subordinates) {

            if (subordinate.uniqueId === employeeID) {
                return { employee: subordinate, oldSupervisor: currentEmployee };
            }

            const result = this.findEmployeeAndOldSupervisor(employeeID, subordinate);
            if (result.employee !== null) {
                return result;
            }
        }

        return { employee: null, oldSupervisor: null };
    }

    private findEmployee(employeeID: number, currentEmployee: Employee = this.ceo): Employee | null {
        if (currentEmployee.uniqueId === employeeID) {
            return currentEmployee;
        }

        for (const subordinate of currentEmployee.subordinates) {
            const result = this.findEmployee(employeeID, subordinate);
            if (result !== null) {
                return result;
            }
        }

        return null;
    }

    private findCurrentSupervisor(
        employeeID: number,
        currentEmployee: Employee
    ): Employee | null {
        for (const subordinate of currentEmployee.subordinates) {
            if (subordinate.uniqueId === employeeID) {
                return currentEmployee;
            }

            const result = this.findCurrentSupervisor(employeeID, subordinate);
            if (result !== null) {
                return result;
            }
        }

        return null;
    }

    private deepClone(obj: any): any {
        return JSON.parse(JSON.stringify(obj));
    }
}