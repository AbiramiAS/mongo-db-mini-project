import mongoose from "mongoose";
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
          _id: {
                    type: Number
          },
          firstname: {
                    type: String,
                    required: true
          },
          lastname: {
                    type: String,
                    required: true
          }
}
);

const EmployeeData = mongoose.model("Employee", employeeSchema);

export default EmployeeData;