// models/employeeModel.js
import mongoose from 'mongoose';
import { enumBloodGroup, enumGender } from './enums.js';
 

const employeeSchema = new mongoose.Schema({
  sequenceNo : { type: Number, unique: true,  default: 0 },
  employeeId: { type: String, unique: true, index: true },
  fullname: { type: String, required: true, trim: true },
  isActive : { type: Boolean, default: true },
  contact: {
    mobile: { type: String,  unique: true,  index: true, required: true, trim: true, match: /^[6-9]\d{9}$/  },
    altMobile: { type: String, trim: true, default:null, match: /^[6-9]\d{9}$/ },
    workMobile: { type: String, trim: true, default:null, match: /^[6-9]\d{9}$/ },
    isVerifyMobile: { type: Boolean, default: false },
    email: { type: String,  unique: true, index: true, required: true, trim: true, match: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/ },
    altEmail: { type: String, trim: true, default:null, match: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/ },
    workEmail: { type: String, trim: true, default:null, match: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/ },
    isVerifyEmail: { type: Boolean, default: false }
  },
  password: [{
    value: { type: String, required: true, trim: true, select: false  },
    at: { type: Date, default: Date.now },
  }],
  otp: {
    otpFor: { type: String, enum: ['login', 'registration','forget-password','verification','other'], default: 'other' },
    otpIn: { type: String, enum: ['email', 'mobile'], default: 'email' },
    temp: { type: String, trim: true, default:null },
    expiryAt: { type: Date, trim: true, default:null },
    generatedAt:{ type: Date, trim: true, default:null },
    validatedAt:{ type: Date, trim: true, default:null },
    isValid:{ type:Boolean, default:false }
  },
  // physicalInfo: {
  //   height: {type: Number,vmin: 30,max: 300,  trim: true, default:null },
  //   weight: {type: Number, min: 1,max: 500,  trim: true, default:null },
  //   bloodGroup: {type: String,enum: enumBloodGroup,default:null},
  //   dateOfBirth: {type: Date,default:null},
  //   gender: {type: String,enum: enumGender, default:'Other'},
  //   isDisabilities: { type:Boolean, default:false },
  //   disabilities: {type: String,default:null,},
  //   isDiseases: { type:Boolean, default:false },
  //   diseases: {type: String, default: null},
  //   medicalNotes: {type: String,default:null}
  // },
  // joining: {
  //   date : { type: Date, default: new Date() },
  //   condidateID:{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  // },


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
      this.employeeId = process.env.EMP_SHORT_CODE + String(nextSeq).padStart(process.env.EMP_SHORT_ZERO, "0");

      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});



 



  // Validate environment variable for collection name
  const EmployeesCollection = process.env.EMPLOYEES;
  if (!EmployeesCollection) {
    throw new Error('❌ Missing "EMPLOYEES" collection in environment variables.');
  }
  const EmployeeModel = mongoose.model('EmpCol', employeeSchema, EmployeesCollection);
  export default EmployeeModel;
   
