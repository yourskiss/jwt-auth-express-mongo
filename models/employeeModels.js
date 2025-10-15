// models/employeeModel.js
import mongoose from 'mongoose';
import {
    enumProgresStatus,
} from './enums.js';
import {
    fileSchema,
    // auditSchema, 
    passwordSchema,
    otpSchema,
    physicalInfoSchema,
    serviceSchema, 
    emergencyContactSchema,
    addressSchema,
    qualificationSchema,
    documentSchema,
    experienceSchema,
    loginHistorySchema,
    updateHistorySchema,
    interviewSchema,
    issueAssetSchema,
    exitApprovalSchema,
    exitAssetSchema,
    handoverApprovalSchema
} from './subdocument.js';
 



// main schema
const employeeSchema = new mongoose.Schema({
  sequenceNo : { type: Number, unique: true,  default: 0 },
  employeeId: { type: String, unique: true, index: true },
  fullname: { type: String, required: true, trim: true },
  isActive : { type: Boolean, default: true },

  // Contact Info
  contact: {
    mobile: { type: String,  unique: true,  index: true, required: true, trim: true, match: /^[6-9]\d{9}$/  },
    altMobile: { type: String, trim: true, default:null, match: /^[6-9]\d{9}$/ },
    workMobile: { type: String, trim: true, default:null, match: /^[6-9]\d{9}$/ },
    isVerifyMobile: { type: Boolean, default: false },
    email: { type: String,  unique: true, index: true, trim: true, match: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/ },
    altEmail: { type: String, trim: true, default:null, match: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/ },
    workEmail: { type: String, trim: true, default:null, match: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/ },
    isVerifyEmail: { type: Boolean, default: false }
  },

  
  // Emergency
  emergencyContact: [emergencyContactSchema],

  // address
  address:[addressSchema],

  // Profile Picture
  profilePicture: [{
    name: { type: String, enum: ['profile', 'cover', 'dashboardicon', 'other'], default: 'profile' },
    file:fileSchema
  }],

  // physical Information
  physicalInfo: physicalInfoSchema,

  // Auth
  password: [passwordSchema],

  // token
  refreshToken: { type: String, trim: true, default:null },

  // OTP
  otp: [otpSchema],

  // joining
  joining: {
    date : { type: Date, default: new Date() },
    interview: [interviewSchema],
    companyAssetsIssued: [issueAssetSchema]
  },

  // Leaving
  leaving: {
    resignationDate:{ type: Date, default:null },
    leavingDate: { type: Date, default:null },
    noticePeriodInDays: { type: Number, min: 0, max: 365, default: 30 },
    reasonForLeaving: { type: String, trim: true, default:null },
    notes: { type: String, trim: true, default: null },
    companyAssets: [exitAssetSchema],
    approval: [exitApprovalSchema]
  },

  // Handover
  projectHandover: [{
    projectName: { type: String, trim: true, default: null },
    description: { type: String, trim: true, default: null },
    handoverDate: { type: Date, trim: true, default: null},
    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee',  },
    receivedAt: { type: Date, trim: true, default: null },
    notes: { type: String, trim: true, default: null},
    status: { type: String, enum: enumProgresStatus, default: 'initiated' },
    documents:[fileSchema],
    approval: [handoverApprovalSchema]
  }],
  
  // service
  serviceHistory:[serviceSchema],

  // qualification
  qualification:[qualificationSchema],

  // documentation
  documentation: [documentSchema],

  // experience
  experience: [experienceSchema],

  // Logs
  loginHistory: [loginHistorySchema],
  updateHistory: [updateHistorySchema]

  }, {
    timestamps: true,
    versionKey: false
  });
  

// ✅ PRE-SAVE For Registation
employeeSchema.pre("save", async function (next) {
  // Only assign new sequence for NEW employees
  if (this.isNew) {
    try {
      // Get latest employee by sequence
      const lastEmp = await this.constructor.findOne({}, { sequenceNo: 1 }).sort({ sequenceNo: -1 }).lean();

      // Calculate next sequence
      const nextSeq = lastEmp ? lastEmp.sequenceNo + 1 : 1;

      // Assign to the document
      this.sequenceNo = nextSeq;
      this.employeeId = `EMP-${String(nextSeq).padStart(7, "0")}`;

      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});
 



  // Validate environment variable for collection name
  const collectionEmployee = process.env.COL_EMPLOYEE;
  if (!collectionEmployee) {
    throw new Error('❌ Missing collection in environment variables.');
  }
  const employeeModel = mongoose.model('Employee', employeeSchema, collectionEmployee);
  export default employeeModel;
   
