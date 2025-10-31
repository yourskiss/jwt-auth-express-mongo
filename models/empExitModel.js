import mongoose from "mongoose";
import { fileSchema } from "./subdocument";
import { enumAssetTypes, enumExitAssetCondition } from "./enums";

const exitSchema = new mongoose.Schema({
  employeeId: { type:String, required: true, trim: true },
    resignationDate:{ type: Date, default:null },
    leavingDate: { type: Date, default:null },
    isNoticeSever :{ type:Boolean, default:false },
    noticePeriodInDays: { type: Number, min: 0, max: 365, default: 30 },
    reasonForLeaving: { type: String, trim: true, default:null },
    notes: { type: String, trim: true, default: null },
    assetsReturn: [{
          assetType: { type: String, enum: enumAssetTypes, default: null  },
          brand: { type: String, trim: true, default: null  },
          model: { type: String, trim: true, default: null  },
          serialNumber: { type: String, trim: true, default: null  },
          condition: { type: String, enum: enumExitAssetCondition, default: 'good' },
          file:fileSchema,

          isSubmitted: { type: Boolean, default: true },
          submittedAt: { type: Date, default: null  },
          submittedNotes: { type: String, trim: true, default: null },

          isReceived : { type: Boolean, default: false },
          receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee',  default: null  },
          receivedAt: { type: Date, trim: true, default: null },
          receivedNotes: { type: String, trim: true, default: null},

          isApproved : { type: Boolean, default: false },
          approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null  },
          approvedAt: { type: Date, default: null },
          approvedNotes: { type: String, trim: true, default: null },
    }],
    projectHandover: [{
      projectName: { type: String, trim: true, default: null },
      description: { type: String, trim: true, default: null },
      file:fileSchema,

      isSubmitted: { type: Boolean, default: true },
      submittedAt: { type: Date, default: null  },
      submittedNotes: { type: String, trim: true, default: null },
      
      isReceived : { type: Boolean, default: false },
      receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee',  default: null  },
      receivedAt: { type: Date, trim: true, default: null },
      receivedNotes: { type: String, trim: true, default: null},

      isApproved : { type: Boolean, default: false },
      approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null  },
      approvedAt: { type: Date, default: null },
      approvedNotes: { type: String, trim: true, default: null }
    }],
    empExitFeedback: { type: String, trim: true, default: null }
}, {
    timestamps: true,
    versionKey: false
  });

  // Validate environment variable for collection name
  const EmployeeExit = process.env.COL_EMP_UPDATE_HISTORY;
  if (!EmployeeExit) {
    throw new Error('❌ Missing "COL_EMP_UPDATE_HISTORY" collection in environment variables.');
  }
  const EmpExitModel = mongoose.model('EmployeeExit', exitSchema, EmployeeExit);
  export default EmpExitModel;

