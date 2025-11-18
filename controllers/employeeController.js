import EmployeeData from "../model/employees.js";

export const getAllEmployeeDetails = async (req, res) => {
  const employees = await EmployeeData.find();
  if (!employees) return res.json("message: No data found!");
  res.json(employees);
};

export const addNewEmployee = async (req, res) => {
  if (!req?.query?.firstname || !req?.query?.lastname) {
    return res
      .status(400)
      .json({ message: "Both First name and last name are required" });
  }

  try {
    const result = await EmployeeData.create({
      firstname: req.query.firstname,
      lastname: req.query.lastname,
    });
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

export const updateEmployeeDetails = async (req, res) => {
  if (!req.query?.id) {
    return res.status(400).json({ message: "ID parameter is required." });
  }
  const employeeFound = await EmployeeData.findOne({
    _id: req.query.id,
  }).exec();
  if (!employeeFound) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.query.id}.` });
  }
  if (req.query?.firstname) employeeFound.firstname = req.query.firstname;
  if (req.query?.lastname) employeeFound.lastname = req.query.lastname;
  const result = await employeeFound.save();
  res.json({ message: "Details Updated Successfully", result });
};

export const deleteEmployee = async (req, res) => {
  if (!req.query?.id)
    return res.status(400).json({ message: "Employee ID required." });

  const employeeFound = await EmployeeData.findOne({
    _id: req.query.id,
  }).exec();

  if (!employeeFound) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.query.id}.` });
  }
  const result = await employeeFound.deleteOne();
  res.json({ meesage: "Employee data deleted successfully", result });
};

export default {
  getAllEmployeeDetails,
  addNewEmployee,
  updateEmployeeDetails,
  deleteEmployee,
};
