import mongoose from "mongoose";

const updateHistorySchema = new mongoose.Schema({
  employeeId: { type:String, required: true, trim: true },
  updateType: { type: String, trim: true, default: null  },
  updateAt: { type: Date, default: Date.now  }, 
  userAgent: {
    device: String,
    platform: String,
    os: String,
    browser: String,
    browserVersion: String,
    ip: String
  }
});

  // Validate environment variable for collection name
  const collectionName = process.env.COL_EMP_UPDATE_HISTORY;
  if (!collectionName) {
    throw new Error('❌ Missing "COL_EMP_UPDATE_HISTORY" collection in environment variables.');
  }
  const UpdateHistoryModel = mongoose.model('EmployeeUpdateHistory', updateHistorySchema, collectionName);
  export default UpdateHistoryModel;

