import mongoose from "mongoose";
import { fileSchema } from "./subdocument";
import { enumEducationLevels, enumEducationTypes, enumMediums } from "./enums";

const qualificationSchema = new mongoose.Schema({
        employeeId: { type:String, required: true, trim: true },
        level: { type: String, enum: enumEducationLevels },
        title: { type: String },
        fieldOfStudy: { type: String, trim: true, default: null },
        institution: { type: String, trim: true, default: null },
        board: { type: String, trim: true, default: null },
        grade: { type: String, trim: true, default: null },
        yearOfPassing: { type: String, trim: true, default: null },
        duration: { type: String, trim: true, default: null },
        from: { type: Date, default:null },
        to: { type: Date, default: null },
        location: { type: String, trim: true, default: null },
        educationType: { type: String, enum: enumEducationTypes, default: 'full-time' },
        medium: { type: String, enum: enumMediums, default: 'english' },
        certificateDocs: [fileSchema],
}, {
    timestamps: true,
    versionKey: false
  });

  // Validate environment variable for collection name
  const EmployeeQualification = process.env.EMP_QUALIFICATION;
  if (!EmployeeQualification) {
    throw new Error('❌ Missing "EMP_QUALIFICATION" collection in environment variables.');
  }
  const EmpQualificationModel = mongoose.model('EmployeeQualification', qualificationSchema, EmployeeQualification);
  export default EmpQualificationModel;

