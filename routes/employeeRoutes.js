import express from "express";
import { addNewEmployee, getAllEmployeeDetails, updateEmployeeDetails, deleteEmployee } from "../controllers/employeeController.js"; 

const router = express.Router();

router
  .route("/")
  .get(getAllEmployeeDetails)
  .post(addNewEmployee)
  .put(updateEmployeeDetails)
  .delete(deleteEmployee);
  
  // router.route("/:id")
  //   .get(getAllEmployeeDetails);
  
export default router;