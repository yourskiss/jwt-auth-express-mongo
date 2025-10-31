import mongoose from "mongoose";
import { enumDepartments,  enumRoles, enumWorkTypes, enumEducationLevels, enumEducationTypes, enumMediums } from "./enums";
import { fileSchema } from "./subdocument";

const condidateInfoSchema = new mongoose.Schema({
                personal : {
                    name: { type: String, trim: true, default: null },
                    phone: { type: String, trim: true,  match: /^[6-9]\d{9}$/ },
                    phoneAlt: { type: String, trim: true,  match: /^[6-9]\d{9}$/ },
                    email: { type: String, trim: true, lowercase: true, match: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/ },
                    emailWork: { type: String, trim: true, lowercase: true, match: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/ },
                    city:  { type: String, trim: true, default: null },
                    dob: { type: String, trim: true, default: null },
                    pan: { type: String, trim: true, default: null },
                    aadhaar: { type: String, trim: true, default: null },
                    uin: { type: String, trim: true, default: null },
                    password:  { type: String, trim: true, default: null },
                },
                file:[fileSchema],
                qualification : [{
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
                }],
                info : {
                    applyfor : { type: String, trim: true, default: null },
                    totalExperience: { type: String, trim: true, default: null },
                    relevantExperience : { type: String, trim: true, default: null },
                    isCareerBreak: { type: Boolean, default: false },
                    careerBreakDuration : { type: String, trim: true, default: null },
                    careerBreakDetail : { type: String, trim: true, default: null },
                    noticePeriodInDays: { type: Number, trim: true, default: 30 },
                    isNoticeServed: { type: Boolean, default: true },
                    noticeNotServeReason: { type: String, trim: true, default: null },
                    reasonForLeaving: { type: String, trim: true, default: null },
                    ectc: { 
                        net: { type: Number, trim: true, default: null },
                        gross: { type: Number, trim: true, default: null },
                    },
                    expectationNotes : { type: String, trim: true, default: null },
                    
                },
                expeprince : [{
                    organization: { type: String, trim: true, default: null },
                    websiteURL: { type: String, trim: true, default: null },
                    designation: { type: String, trim: true },
                    department: {type: String,enum: enumDepartments,default: 'others'},
                    role: {type: String,enum: enumRoles,default: 'employee'},
                    workType: {type: String,enum: enumWorkTypes,default: 'full-time'},
                    worklocation: { type: String, trim: true, default: null },
                    totalexpeprince: { type: String, trim: true },
                    responsibilities: [String],
                    achievements: [String],
                    skillsUsed: [String],
                    from: { type: Date, default:null },
                    to: { type: Date, default: null },
                    ctc: { 
                        net: { type: Number, trim: true, default: null },
                        gross: { type: Number, trim: true, default: null },
                    },
                    pf:{
                        isPF : { type: Boolean, default: false },
                        pfNumber:  { type: Number, trim: true, default: null },
                        pfDiductionAmout:  { type: Number, trim: true, default: null },
                    },
                    contactPersonName: { type: String, trim: true, default: null },
                    contactPersonDesignation: { type: String, trim: true, default: null },
                    contactPersonPhone: { type: String, trim: true,  match: /^[6-9]\d{9}$/ },
                    contactPersonEmail: { type: String, trim: true, lowercase: true, match: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/ },
                    contactPersonFeedback: { type: String, trim: true, default: null },
                    reportingManagerName: { type: String, trim: true, default: null },
                    reportingManagerDesignation: { type: String, trim: true, default: null },
                    reportingManagerPhone: { type: String, trim: true,  match: /^[6-9]\d{9}$/ },
                    reportingManagerEmail: { type: String, trim: true, lowercase: true, match: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/ },
                    reportingManagerFeedback: { type: String, trim: true, default: null },
                    notes:  { type: String, trim: true },    
                }],
}, {
    timestamps: true,
    versionKey: false
});

  // Validate environment variable for collection name
  const CondidateInfo = process.env.CONDIDATE_INFO;
  if (!CondidateInfo) {
    throw new Error('❌ Missing "CONDIDATE_INFO" collection in environment variables.');
  }
  const CondidateInfoModel = mongoose.model('CondidateInfo', condidateInfoSchema, CondidateInfo);
  export default CondidateInfoModel;

