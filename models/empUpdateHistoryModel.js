import mongoose from "mongoose";

const empUpdateHistorySchema = new mongoose.Schema({
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
  const EmployeeUpdateHistory = process.env.EMP_UPDATE_HISTORY;
  if (!EmployeeUpdateHistory) {
    throw new Error('❌ Missing "EMP_UPDATE_HISTORY" collection in environment variables.');
  }
  const EmpUpdateHistoryModel = mongoose.model('EmployeeUpdateHistory', empUpdateHistorySchema, EmployeeUpdateHistory);
  export default EmpUpdateHistoryModel;

