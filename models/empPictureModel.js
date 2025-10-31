import mongoose from "mongoose";
import { fileSchema } from "./subdocument";

const imageSchema = new mongoose.Schema({
  employeeId: { type:String, required: true, trim: true },
  name: { type: String, enum: ['profile', 'cover', 'dashboardicon', 'other'], default: 'profile' },
  file:fileSchema
}, {
    timestamps: true,
    versionKey: false
  });


  // Validate environment variable for collection name
  const EmployeeImage = process.env.EMP_PICTURE;
  if (!EmployeeImage) {
    throw new Error('❌ Missing "EMP_PICTURE" collection in environment variables.');
  }
  const EmpImageModel = mongoose.model('EmployeeImage', imageSchema, EmployeeImage);
  export default EmpImageModel;

