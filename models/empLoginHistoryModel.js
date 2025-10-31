import mongoose from "mongoose";

const empLoginHistorySchema = new mongoose.Schema({
  employeeId: { type:String, required: true },
  loginAt: { type: Date, default: Date.now },
  loginType: { type:String, default:null },
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
  const EmployeeLoginHistory = process.env.EMP_LOGIN_HISTORY;
  if (!EmployeeLoginHistory) {
    throw new Error('❌ Missing "EMP_LOGIN_HISTORY" collection in environment variables.');
  }
  const EmpLoginHistoryModel = mongoose.model('EmployeeLoginHistory', empLoginHistorySchema, EmployeeLoginHistory);
  export default EmpLoginHistoryModel;

