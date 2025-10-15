// models/employeeModel.js
import { name } from 'ejs';
import mongoose from 'mongoose';
import { boolean } from 'zod';

const employeeSchema = new mongoose.Schema({
  // Identity
  employeeId: { type: String, required: true, unique: true, trim: true }, // e.g., EMP001
  fullname: { type: String, required: true, trim: true },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
  dob: { type: Date, default: null },
  status: {type: String, enum: ['active', 'inactive', 'blocked'], default: 'active'  },

  // Contact Info
  mobile: { type: String, required: true, unique: true, trim: true },
  mobileAlt: { type: String, unique: true, trim: true, default: null },
  email: { type: String, required: true, unique: true, trim: true },
  emailAlt: { type: String, unique: true, trim: true, default: null },
  workEmail: { type: String, trim: true, unique: true, sparse: true, default: null }, 
  workMobile: { type: String, trim: true, unique: true, sparse: true,  default: null }, 

  // Auth
  password: [{ 
    value : { type:String, required: true, trim: true },
    at : { type: Date, default: Date.now },
  }], 
  refreshToken: { type: String, trim: true, default: null },

  // Emergency
  emergencyContact: [{
    relation: { type: String, enum: ['father', 'mother', 'spose','friend','subling','other'], default: 'other', trim: true }, 
    parson: { type: String, default: null, trim: true },
    phone: { type: String, default: null, trim: true },
    phoneAlt: { type: String, default: null, trim: true },
    submitted: { type: Boolean, default: false },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    submittedAt: { type: Date, default: null },
    verified: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    verifiedAt: { type: Date, default: null },
    notes: { type: String, trim: true, default: null }
  }],

  // Address
  permanent : [{
    house: { type: String, default: null, trim: true },
    street: { type: String, default: null, trim: true },
    city: { type: String, default: null, trim: true },
    state: { type: String, default: null, trim: true },
    country: { type: String, default: null, trim: true },
    pincode: { type: String, default: null, trim: true },
    from: { type: Date, default: null },
    to: { type: Date, default: null },
    ownership : { type: String, enum: ['self', 'family', 'rant', 'other'], default: 'other', trim: true },
    livingwith : { type: String, enum: ['self', 'family', 'friend', 'other'], default: 'other', trim: true },
    file: {
      name: { type: String, default: null, trim: true },
      url: { type: String, default: null, trim: true },
      filename: { type: String, default: null, trim: true },
      contentType: { type: String, default: null, trim: true },
    },
    submitted: { type: Boolean, default: false },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    submittedAt: { type: Date, default: null },
    verified: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    verifiedAt: { type: Date, default: null },
    notes: { type: String, trim: true, default: null }
  }],
  correspondence: [{
    house: { type: String, default: null, trim: true },
    street: { type: String, default: null, trim: true },
    city: { type: String, default: null, trim: true },
    state: { type: String, default: null, trim: true },
    country: { type: String, default: null, trim: true },
    pincode: { type: String, default: null, trim: true },
    from: { type: Date, default: null },
    to: { type: Date, default: null },
    ownership : { enum: ['self', 'family', 'rant'], default: 'rant', trim: true },
    livingwith : { enum: ['self', 'family', 'friend'], default: 'self', trim: true },
    file: {
      name: { type: String, default: null, trim: true },
      url: { type: String, default: null, trim: true },
      filename: { type: String, default: null, trim: true },
      contentType: { type: String, default: null, trim: true },
    },
    submitted: { type: Boolean, default: false },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    submittedAt: { type: Date, default: null },
    verified: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    verifiedAt: { type: Date, default: null },
    notes: { type: String, trim: true, default: null }
  }],

  // Profile
  profilepicture: [{
    name: { type: String, trim: true, enum: ['profile', 'cover', 'dashboardicon', 'other'], default: 'profile'  },
    url: { type: String, default: null, trim: true },
    filename: { type: String, default: null, trim: true },
    contentType: { type: String, default: null, trim: true },
  }],

  // Role & Hierarchy
  service: [{
    designation: { type: String, trim: true, required: true },
    department: { type: String, enum: ['hr', 'art', 'engineering', 'sales', 'marketing', 'finance', 'support'], default: 'engineering', trim: true },
    role: { type: String, enum: ['employee', 'manager', 'hr', 'admin', 'director', 'superadmin'], default: 'employee'  },
    workType: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance', 'temporary'], default: 'full-time' },
    location: { type: String, trim: true, default: null },
    from: { type: Date, required: true },
    to: { type: Date, default: null },
    responsibilities: { type: [String], default: [] },
    achievements: { type: [String], default: [] },
    skillsUsed: { type: [String], default: [] },
    ctc: { type: Number, default: null },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    file: {
      name: { type: String, default: null, trim: true },
      url: { type: String, default: null, trim: true },
      filename: { type: String, default: null, trim: true },
      contentType: { type: String, default: null, trim: true },
    },
    submitted: { type: Boolean, default: false },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    submittedAt: { type: Date, default: null },
    verified: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    verifiedAt: { type: Date, default: null },
    notes: { type: String, trim: true, default: null }
  }],

  // Employment Details
  dateOfJoining: { type: Date, default: null },
  dateOfLeaving: { type: Date, default: null },
  noticePeriodInDays: { type: Number, trim: true, default: 30 },
  reasonForLeaving: { type: String, trim: true, default: null },

  // Metadata
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },

  // Email OTP 
  emailOtpTemp: { type: String, default: null },
  emailOtpExpiry: { type: Date, default: null },

  // Mobile OTP 
  mobileOtpTemp: { type: String, default: null },
  mobileOtpExpiry: { type: Date, default: null },


  // Verification Status  
  documentation: {
    email: { type: Boolean, default: false },
    mobile: { type: Boolean, default: false },
    proofDocs: [{ 
      name: { type: String, trim: true, enum: ['Aadhaar', 'Pan', 'UAN', 'Form-16', 'Bank', 'other'], default: 'other' },
      
      number: { type: String, trim: true, default: null },
      
      year: { type: String, trim: true, default: null },
      assesmentYear: { type: String, trim: true, default: null },

      bankname: { type: String, trim: true, default: null },
      accountNumber: { type: String, trim: true, default: null },
      ifsc: { type: String, trim: true, default: null },
      branch: { type: String, trim: true, default: null },

      file : { 
        url: { type: String, default: null, trim: true },
        filename: { type: String, default: null, trim: true },
        contentType: { type: String, default: null, trim: true }
      },
      submitted: { type: Boolean, default: false },
      submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
      submittedAt: { type: Date, default: null },
      verified: { type: Boolean, default: false },
      verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
      verifiedAt: { type: Date, default: null },
      notes: { type: String, trim: true, default: null }
    }],
    experience: [{
      organization: { type: String, trim: true, required: true },
      websiteURL: { type: String, trim: true, default: null },
      noticePeriodInDays: { type: Number, default: null },
      noticeServe: { type: Boolean, default: true },
      noticeNotServeReason: { type: String, default: null },
      reasonForLeaving: { type: String, trim: true, default: null },
      cpName: { type: String, trim: true, default: null },
      cpDesignation: { type: String, trim: true, default: null },
      cpPhone: { type: String, trim: true, default: null },
      cpEmail: { type: String, trim: true, default: null },
      cpFeedback : { type: String, trim: true, default: null },
      service: [{
        designation: { type: String, trim: true, required: true },
        department: { type: String, enum: ['hr', 'art', 'engineering', 'sales', 'marketing', 'finance', 'support'], default: 'engineering', trim: true },
        role: { type: String, enum: ['employee', 'manager', 'hr', 'admin', 'director', 'superadmin'], default: 'employee'  },
        workType: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance', 'temporary'], default: 'full-time' },
        from: { type: Date, required: true },
        to: { type: Date, default: null },
        location: { type: String, trim: true, default: null },
        responsibilities: { type: [String], default: [] },
        achievements: { type: [String], default: [] },
        skillsUsed: { type: [String], default: [] },
        ctc: { type: Number, default: null },
        rmName: { type: String, trim: true, default: null },
        rmDesignation: { type: String, trim: true, default: null },
        rmPhone: { type: String, trim: true, default: null },
        rmEmail: { type: String, trim: true, default: null },
        rmFeedback : { type: String, trim: true, default: null },
        suportingDoc  : { 
          name: { type: String, trim: true, default: null },
          url: { type: String, default: null, trim: true },
          filename: { type: String, default: null, trim: true },
          contentType: { type: String, default: null, trim: true }
        },
        submitted: { type: Boolean, default: false },
        submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
        submittedAt: { type: Date, default: null },
        verified: { type: Boolean, default: false },
        verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
        verifiedAt: { type: Date, default: null },
        notes: { type: String, trim: true, default: null }
      }],
      letterDocs : [{ 
        name: { type: String, trim: true, enum: ['Relieving', 'experience', 'joining', 'offer', 'other'], default: 'other'},
        url: { type: String, default: null, trim: true },
        filename: { type: String, default: null, trim: true },
        contentType: { type: String, default: null, trim: true },
        submitted: { type: Boolean, default: false },
        submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
        submittedAt: { type: Date, default: null },
        verified: { type: Boolean, default: false },
        verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
        verifiedAt: { type: Date, default: null },
        notes: { type: String, trim: true, default: null }
      }],
      submitted: { type: Boolean, default: false },
      submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
      submittedAt: { type: Date, default: null },
      verified: { type: Boolean, default: false },
      verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
      verifiedAt: { type: Date, default: null },
      notes: { type: String, trim: true, default: null }
    }],
  },
  qulificatin : [{
    degree: { type: String, trim: true, required: true },
    fieldOfStudy: { type: String, trim: true, default: null },
    institution: { type: String, trim: true, default: null },
    board: { type: String, trim: true, default: null },
    grade: { type: String, trim: true, default: null }, 
    yearOfPassing: { type: String, trim: true, default: null },
    duration: { type: String, trim: true, default: null },
    from: { type: Date, default: null },
    to: { type: Date, default: null },
    location: { type: String, trim: true, default: null },
    educationType: { type: String, enum: ['full-time', 'part-time', 'distance', 'other'], default: 'full-time' },
    medium: { type: String, enum: ['english', 'hindi', 'other'], default: 'english' },
    certificateDocs : [{ 
      name: { type: String, trim: true, default: null },
      url: { type: String, default: null, trim: true },
      filename: { type: String, default: null, trim: true },
      contentType: { type: String, default: null, trim: true },
    }],
    submitted: { type: Boolean, default: false },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    submittedAt: { type: Date, default: null },
    verified: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    verifiedAt: { type: Date, default: null },  
    notes: { type: String, trim: true, default: null }
  }],
  qualification: [{
    level: {type: String, enum: ['10th','12th','diploma','bachelor','master','phd','certification','training','other'], required: true},
    title: { type: String, trim: true, required: true }, // e.g. B.Sc, MBA, CBSE 10th
    fieldOfStudy: { type: String, trim: true, default: null }, // e.g. Physics, Computer Science
    institution: { type: String, trim: true, default: null },
    board: { type: String, trim: true, default: null }, // For 10th/12th
    grade: { type: String, trim: true, default: null }, // GPA, %, etc.
    yearOfPassing: { type: String, trim: true, default: null }, // or type: Number
    duration: { type: String, trim: true, default: null }, // e.g. "3 years"
    from: { type: Date, default: null },
    to: { type: Date, default: null },
    location: { type: String, trim: true, default: null },
    educationType: { type: String, enum: ['full-time', 'part-time', 'distance', 'online', 'other'], default: 'full-time'},
    medium: { type: String, enum: ['english', 'hindi', 'regional', 'other'], default: 'english'},
    certificateDocs: [{
      name: { type: String, trim: true, default: null },
      url: { type: String, default: null, trim: true },
      filename: { type: String, default: null, trim: true },
      contentType: { type: String, default: null, trim: true }
    }],
    submitted: { type: Boolean, default: false },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    submittedAt: { type: Date, default: null },
    verified: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    verifiedAt: { type: Date, default: null },
    notes: { type: String, trim: true, default: null }
  }],



  // logs
  loginHistory: [{
    at: { type: Date, default: Date.now }, 
    ip: { type: String, trim: true },  
    device: { type: String, trim: true }, 
    os: { type: String, trim: true },
    osVersion: { type: String, trim: true },
    browser:{ type: String, trim: true },
    browserVersion: { type: String, trim: true },
  }],
  updateHistory: [{
    what: { type: String, trim: true },
    previousValue: { type: mongoose.Schema.Types.Mixed },
    newValue: { type: mongoose.Schema.Types.Mixed },
    by: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },  
    at: { type: Date, default: Date.now }, 
    ip: { type: String, trim: true },  
    device: { type: String, trim: true }, 
    os: { type: String, trim: true },
    osVersion: { type: String, trim: true },
    browser:{ type: String, trim: true },
    browserVersion: { type: String, trim: true },
  }],


}, {
  timestamps: true,
  versionKey: false
});

// Validate environment variable for collection name
if (!process.env.COL_EMPLOYEE) {
  throw new Error('❌ Missing collection name in environment variables.');
}

const collectionName = process.env.COL_EMPLOYEE;
const EmployeeModel = mongoose.model('Employee', employeeSchema, collectionName);

export default EmployeeModel;
