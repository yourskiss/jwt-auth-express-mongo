import mongoose from "mongoose";
import { enumAssetTypes, enumIssueAssetCondition } from "./enums";

const assetsSchema = new mongoose.Schema({
  employeeId: { type:String, required: true, trim: true },
    assetType: { type: String, enum: enumAssetTypes, default: null  },
    brand: { type: String, trim: true, default: null  },
    model: { type: String, trim: true, default: null  },
    serialNumber: { type: String, trim: true, default: null  },
    issuedAt: { type: Date, default: null  },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    condition: { type: String, enum: enumIssueAssetCondition, default: 'new' },
    notes: { type: String, trim: true, default: null }
}, {
    timestamps: true,
    versionKey: false
});

  // Validate environment variable for collection name
  const EmployeeAssets = process.env.EMP_ASSETS;
  if (!EmployeeAssets) {
    throw new Error('❌ Missing "EMP_ASSETS" collection in environment variables.');
  }
  const EmpAssetsModel = mongoose.model('EmployeeAssets', assetsSchema, EmployeeAssets);
  export default EmpAssetsModel;

