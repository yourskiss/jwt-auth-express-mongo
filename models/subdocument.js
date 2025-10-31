// models/subdocument.js
import mongoose from 'mongoose';
 
  // File subdocument
  export const fileSchema = new mongoose.Schema({
    name: { type: String, trim: true, default: null },
    url: { type: String, trim: true, default: null },
    filename: { type: String, trim: true, default: null },
    contentType: { type: String, trim: true, default: null },
    uploadedAt: { type: Date, default: Date.now }
  }, { _id: false });
  // Audit subdocument
  export const createSchema = new mongoose.Schema({
    isCreated: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    createdAt: { type: Date, default: Date.now  },
    createdNotes: { type: String, trim: true, default: null },
  }, { _id: false });
  export const submittedSchema = new mongoose.Schema({
    isSubmitted: { type: Boolean, default: false },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    submittedAt: { type: Date, default: Date.now  },
    submittedNotes: { type: String, trim: true, default: null },
  }, { _id: false });
   export const receivedSchema = new mongoose.Schema({
    isReceived : { type: Boolean, default: false },
    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee',  default: null  },
    receivedAt: { type: Date, trim: true, default: null },
    receivedNotes: { type: String, trim: true, default: null},
  }, { _id: false });
  export const verifiedSchema = new mongoose.Schema({
    isVerified: { type: Boolean, default: false },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    verifiedAt: { type: Date, default: Date.now  },
    verifiedNotes: { type: String, trim: true, default: null },
  }, { _id: false });
  export const approvedSchema = new mongoose.Schema({
    isApproved: { type: Boolean, default: false },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    approvedAt: { type: Date, default: Date.now  },
    approvedNotes: { type: String, trim: true, default: null },
  }, { _id: false });
  export const rejectedSchema = new mongoose.Schema({
    isRejected: { type: Boolean, default: false },
    rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    rejectedAt: { type: Date, default: Date.now  },
    rejectedNotes: { type: String, trim: true, default: null },
  }, { _id: false });
  export const issueSchema = new mongoose.Schema({
    isIssue: { type: Boolean, default: false },
    issueBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    issueAt: { type: Date, default: Date.now  },
    issueNotes: { type: String, trim: true, default: null },
  }, { _id: false });
  export const validSchema = new mongoose.Schema({
    isValid: { type: Boolean, default: false },
    validBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    validAt: { type: Date, default: Date.now  },
    validFrom: { type: Date, default: null  },
    validTo: { type: Date, default: null  },
    validNotes: { type: String, trim: true, default: null },
  }, { _id: false });
  
 