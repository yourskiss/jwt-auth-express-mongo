import mongoose from "mongoose";
import { enumDocument } from "./enums";
import { fileSchema } from "./subdocument";

const documentationSchema = new mongoose.Schema({
          employeeId: { type:String, required: true, trim: true },
          name: { type: String, enum: enumDocument, default: 'other' },
          number: { type: String, trim: true, default: null },
          year: { type: String, trim: true, default: null },
          assessmentYear: { type: String, trim: true, default: null },
          bankName: { type: String, trim: true, default: null },
          accountNumber: { type: String, trim: true, default: null },
          ifsc: { type: String, trim: true, default: null },
          branch: { type: String, trim: true, default: null },
          file: fileSchema,
}, {
    timestamps: true,
    versionKey: false
  });

  // Validate environment variable for collection name
  const EmployeeDocumentation = process.env.EMP_DOCUMENTATION;
  if (!EmployeeDocumentation) {
    throw new Error('❌ Missing "EMP_DOCUMENTATION" collection in environment variables.');
  }
  const EmpDocumentationModel = mongoose.model('EmployeeDocumentation', documentationSchema, EmployeeDocumentation);
  export default EmpDocumentationModel;

