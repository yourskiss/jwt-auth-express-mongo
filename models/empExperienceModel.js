import mongoose from "mongoose";
import { enumLetter, enumDepartments,  enumRoles, enumWorkTypes } from "./enums";
import { fileSchema } from "./subdocument";

const experienceSchema = new mongoose.Schema({
          employeeId: { type:String, required: true, trim: true },
          organization: { type: String, trim: true, default: null },
          websiteURL: { type: String, trim: true, default: null },
          noticePeriodInDays: { type: Number, trim: true, default: 30 },
          isNoticeServed: { type: Boolean, default: true },
          noticeNotServeReason: { type: String, trim: true, default: null },
          reasonForLeaving: { type: String, trim: true, default: null },
          contactPersonName: { type: String, trim: true, default: null },
          contactPersonDesignation: { type: String, trim: true, default: null },
          contactPersonPhone: { type: String, trim: true,  match: /^[6-9]\d{9}$/ },
          contactPersonEmail: { type: String, trim: true, lowercase: true, match: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/ },
          contactPersonFeedback: { type: String, trim: true, default: null },
          letter: [{
            name: { type: String, enum: enumLetter, default: 'other' },
            file:fileSchema,
          }],
          service: [{
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
                  reportingManagerName: { type: String, trim: true, default: null },
                  reportingManagerDesignation: { type: String, trim: true, default: null },
                  reportingManagerPhone: { type: String, trim: true,  match: /^[6-9]\d{9}$/ },
                  reportingManagerEmail: { type: String, trim: true, lowercase: true, match: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/ },
                  reportingManagerFeedback: { type: String, trim: true, default: null },
                  file: fileSchema,
                  notes:  { type: String, trim: true }
          }],
}, {
    timestamps: true,
    versionKey: false
  });

  // Validate environment variable for collection name
  const EmployeeExperience = process.env.EMP_EXPERIENCE;
  if (!EmployeeExperience) {
    throw new Error('❌ Missing "EMP_EXPERIENCE" collection in environment variables.');
  }
  const EmpExperienceModel = mongoose.model('EmployeeExperience', experienceSchema, EmployeeExperience);
  export default EmpExperienceModel;

