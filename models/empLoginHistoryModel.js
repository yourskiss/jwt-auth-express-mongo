import mongoose from "mongoose";

const loginHistorySchema = new mongoose.Schema({
  employeeId: { type:String, required: true },
  loginAt: { type: Date, default: Date.now },
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
  const collectionName = process.env.COL_EMP_LOGIN_HISTORY;
  if (!collectionName) {
    throw new Error('❌ Missing "COL_EMP_LOGIN_HISTORY" collection in environment variables.');
  }
  const LoginHistoryModel = mongoose.model('EmployeeLoginHistory', loginHistorySchema, collectionName);
  export default LoginHistoryModel;

