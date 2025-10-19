// models/subdocument.js
import mongoose from 'mongoose';
import {
    enumDepartments,
    enumApproval,
    enumRoles,
    enumWorkTypes,
    enumAssetTypes,
    enumEducationLevels,
    enumEducationTypes,
    enumMediums,
    enumOwnership,
    enumLivingWith,
    enumRelation,
    enumAddress,
    enumDocument,
    enumLetter,
    enumIntractionType,
    enumIssueAssetCondition,
    enumExitAssetCondition,
    enumApprovalStatus,
    enumInterviewStatus,
    enumGender,
    enumBloodGroup
} from './enums.js';


  // File subdocument
  export const fileSchema = new mongoose.Schema({
    name: { type: String, trim: true, default: null },
    url: { type: String, trim: true, default: null },
    filename: { type: String, trim: true, default: null },
    contentType: { type: String, trim: true, default: null },
    uploadedAt: { type: Date, default: Date.now }
  }, { _id: false });

  // Audit subdocument
  export const auditSchema = new mongoose.Schema({
    submitted: { type: Boolean, default: false },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    submittedAt: { type: Date, default: Date.now  },
    verified: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    verifiedAt: { type: Date, default: null },
    notes: { type: String, trim: true, default: null },
  }, {
    _id: false,
    timestamps: true,
    versionKey: false
  });

  // Password subdocument
  export const passwordSchema = new mongoose.Schema({
    value: { type: String, required: true, trim: true, select: false  },
    at: { type: Date, default: Date.now },
  }, { _id: false });

  // OTP subdocument
  export const otpSchema = new mongoose.Schema({
    otpFor: { type: String, enum: ['login', 'registration','forget-password','verification','other'], default: 'other' },
    otpIn: { type: String, enum: ['email', 'mobile'], default: 'email' },
    temp: { type: String, trim: true, default:null },
    expiryAt: { type: Date, trim: true, default:null },
    generatedAt:{ type: Date, trim: true, default:null },
    validatedAt:{ type: Date, trim: true, default:null },
    isValid:{ type:Boolean, default:false }
  }, { _id: false });

  // Physical Info
  export const physicalInfoSchema = new mongoose.Schema({
    height: {type: Number,vmin: 30,max: 300,  trim: true, default:null },
    weight: {type: Number, min: 1,max: 500,  trim: true, default:null },
    bloodGroup: {type: String,enum: enumBloodGroup,default:null},
    dateOfBirth: {type: Date,default:null},
    gender: {type: String,enum: enumGender, default:'Other'},
    isDisabilities: { type:Boolean, default:false },
    disabilities: {type: String,default:null,},
    isDiseases: { type:Boolean, default:false },
    diseases: {type: String, default: null},
    medicalNotes: {type: String,default:null}
  }, { _id: false });

  // Service History subdocument
  export const serviceSchema = new mongoose.Schema({
    designation: { type: String, trim: true },
    department: {
      type: String,
      enum: enumDepartments,
      default: 'engineering'
    },
    role: {
      type: String,
      enum: enumRoles,
      default: 'employee'
    },
    workType: {
      type: String,
      enum: enumWorkTypes,
      default: 'full-time'
    },
    location: { type: String, trim: true, default: null },
    from: { type: Date, },
    to: { type: Date },
    responsibilities: [String],
    achievements: [String],
    skillsUsed: [String],
    ctc: Number,
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    file: fileSchema,
    audit: auditSchema
  }, { _id: false });

  // Emergency Contact  subdocument
  export const emergencyContactSchema = new mongoose.Schema({
      relation: { type: String, enum: enumRelation, default: 'other', trim: true },
      person: { type: String, trim: true },
      phone:  { type: String, trim: true,  match: /^[6-9]\d{9}$/ },
      phoneAlt:  { type: String, trim: true,  match: /^[6-9]\d{9}$/ },
      email:  { type: String, trim: true, lowercase: true, match: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/ },
      audit:auditSchema
  }, { _id: false })

  // Address subdocument
  export const addressSchema = new mongoose.Schema({
      addressType: { type: String, enum: enumAddress, default: 'other' },
      house: { type: String, trim: true, default: null },
      floor: { type: String, trim: true, default: null },
      street: { type: String, trim: true, default: null },
      area: { type: String, trim: true, default: null },
      city: { type: String, trim: true, default: null },
      state: { type: String, trim: true, default: null },
      country: { type: String, trim: true, default: null },
      pincode: { type: String, trim: true, default: null },
      from: { type: Date, default: null },
      to: { type: Date, default: null },
      ownership: { type: String, enum: enumOwnership, default: 'other' },
      livingWith: { type: String, enum: enumLivingWith, default: 'other' },
      file: fileSchema,
      audit:auditSchema
  }, { _id: false })

  // Qualification subdocument
  export const qualificationSchema = new mongoose.Schema({
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
      audit:auditSchema
  }, { _id: false })

  // Document subdocument
  export const documentSchema = new mongoose.Schema({
        name: { type: String, enum: enumDocument, default: 'other' },
        number: { type: String, trim: true, default: null },
        year: { type: String, trim: true, default: null },
        assessmentYear: { type: String, trim: true, default: null },
        bankName: { type: String, trim: true, default: null },
        accountNumber: { type: String, trim: true, default: null },
        ifsc: { type: String, trim: true, default: null },
        branch: { type: String, trim: true, default: null },
        file: fileSchema,
        audit:auditSchema
  }, { _id: false })

    // External Service subdocument
    const serviceExternalSchema = serviceSchema.clone();
    serviceExternalSchema.remove('manager');
    serviceExternalSchema.add({
        reportingManagerName: { type: String, trim: true, default: null },
        reportingManagerDesignation: { type: String, trim: true, default: null },
        reportingManagerPhone: { type: String, trim: true,  match: /^[6-9]\d{9}$/ },
        reportingManagerEmail: { type: String, trim: true, lowercase: true, match: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/ },
        reportingManagerFeedback: { type: String, trim: true, default: null },
    });

  // Experience subdocument
  export const experienceSchema = new mongoose.Schema({
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
        service: [serviceExternalSchema],
        letter: [{
          name: { type: String, enum: enumLetter, default: 'other' },
          file:fileSchema,
          audit:auditSchema
        }],
        audit:auditSchema
  }, { _id: false })

 

  // Interview subdocument
  export const interviewSchema = new mongoose.Schema({
    round: { type: Number, min: 1, max: 10 },
    interviewWith: { type: String, enum: enumIntractionType, default: 'other', trim: true },  
    interviewBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    interviewAt: { type: Date, default: null },
    topics: [{
          topic: { type: String, default: null },
          describe:  { type: String,  default: null },
          rate:{ type:Number, min:1, max:10, default:5 }
    }],
    isCompleted: { type: Boolean, default: false },
    interviewStatus : { type: String, enum: enumInterviewStatus, default: 'in-progress', trim: true  },
    overallRating: { type:Number, min:1, max:10, default:5 },
    finalNotes: { type: String, trim: true, default: null },
  }, { _id: false });

  // Issue Asset subdocument
  export const issueAssetSchema = new mongoose.Schema({
    assetType: { type: String, enum: enumAssetTypes, default: null  },
    brand: { type: String, trim: true, default: null  },
    model: { type: String, trim: true, default: null  },
    serialNumber: { type: String, trim: true, default: null  },
    issuedAt: { type: Date, default: null  },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    condition: { type: String, enum: enumIssueAssetCondition, default: 'new' },
    notes: { type: String, trim: true, default: null }
  }, { _id: false });

  // Approval subdocument
  export const exitApprovalSchema = new mongoose.Schema({
    department: { type: String, enum: enumApproval, default: 'other', trim: true },  
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null  },
    approvedAt: { type: Date, default: null },
    remarks: { type: String, trim: true, default: null },
    status: { type: String, enum: enumApprovalStatus, default: 'pending' }
  }, { _id: false });

  // Exit Asset subdocument
  export const exitAssetSchema = new mongoose.Schema({
    assetType: { type: String, enum: enumAssetTypes, default: null  },
    brand: { type: String, trim: true, default: null  },
    model: { type: String, trim: true, default: null  },
    serialNumber: { type: String, trim: true, default: null  },
    submitted: { type: Boolean, default: false },
    submittedAt: { type: Date, default: null  },
    condition: { type: String, enum: enumExitAssetCondition, default: 'good' },
    notes: { type: String, trim: true, default: null }
  }, { _id: false });

  // Approval subdocument
  export const handoverApprovalSchema = new mongoose.Schema({
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null  },
    approvedAt: { type: Date, default: null },
    remarks: { type: String, trim: true, default: null },
    status: { type: String, enum: enumApprovalStatus, default: 'pending' }
  }, { _id: false });


