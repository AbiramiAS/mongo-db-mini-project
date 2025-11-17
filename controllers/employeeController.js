import {employeeData} from "../model/employees.js";

// Get all employee details
export const getAllEmployeeDetails = (req, res) => {
  console.log("Employee data requested", employeeData.data);
  res.json(employeeData.data);
};

export const addNewEmployee = (req, res) => { 
  const newEmployee = req.query;
  newEmployee.id = employeeData.data[employeeData.data.length-1].id + 1; 
  console.log('Adding new employee :', newEmployee.id);
  employeeData.data.push(newEmployee);
  res
    .status(201)
    .json({
      message: "Employee data added successfully",
      employee: newEmployee,
    });
};

export const updateEmployeeDetails = (req, res) => {
  const empId = parseInt(req.query.id);
  console.log('Updating employee :', req);
  const updatedData = req.query;
  const employeeIndex = employeeData.data.findIndex(emp => emp.id === empId);
  if (employeeIndex !== -1) {
    employeeData.data[employeeIndex] = { id: parseInt(empId), firstname: updatedData.firstname, lastname: updatedData.lastname };
    res.json({
      message: "Employee data updated successfully",
      employee: employeeData.data[employeeIndex],
    });
  } else {
    res.status(404).json({ message: "Employee not found" });
  }
};

export const deleteEmployee = (req, res) => {
  const empId = parseInt(req.query.id);
  const employeeIndex = employeeData.data.findIndex(emp => emp.id === empId);
  if (employeeIndex !== -1) {
    const deletedEmployee = employeeData.data.splice(employeeIndex, 1);
    res.json({
      message: "Employee deleted successfully",
      employee: deletedEmployee[0],
    });
  } else {
    res.status(404).json({ message: "Employee not found" });
  } 
};

export default {
  getAllEmployeeDetails,
  addNewEmployee,
  updateEmployeeDetails,
  deleteEmployee
};