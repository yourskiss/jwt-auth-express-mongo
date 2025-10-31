import mongoose from "mongoose";
import { fileSchema } from "./subdocument";
import { enumDepartments, enumRoles, enumWorkTypes } from "./enums";

const serviceHistorySchema = new mongoose.Schema({
      employeeId: { type:String, required: true, trim: true },
      designation: { type: String, trim: true },
      department: {type: String,enum: enumDepartments,default: 'others'},
      role: {type: String,enum: enumRoles,default: 'employee'},
      workType: {type: String,enum: enumWorkTypes,default: 'full-time'},
      location: { type: String, trim: true, default: null },
      from: { type: Date, },
      to: { type: Date },
      responsibilities: [String],
      achievements: [String],
      skillsUsed: [String],
      ctc: { 
        net: { type: Number, trim: true, default: null },
        gross: { type: Number, trim: true, default: null },
      },
      manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
      file: fileSchema,
      notes:  { type: String, trim: true },
      notice : {
          isNoticeApplicable:  { type: Boolean, default: true },
          noticePeriodInDays: { type: Number, trim: true, default: 30 },
          noticeTerms : { type: String, trim: true, default: null }
      }
}, {
    timestamps: true,
    versionKey: false
  });

  // Validate environment variable for collection name
  const EmployeeServiceHistory = process.env.EMP_SERVICE_HISTORY;
  if (!EmployeeServiceHistory) {
    throw new Error('❌ Missing "EMP_SERVICE_HISTORY" collection in environment variables.');
  }
  const EmpServiceHistoryModel = mongoose.model('EmployeeServiceHistory', serviceHistorySchema, EmployeeServiceHistory);
  export default EmpServiceHistoryModel;

