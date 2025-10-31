import mongoose from "mongoose";

const empTokenSchema = new mongoose.Schema({
  employeeId: { type:String, required: true, trim: true },
  token: { type: String, default: null, index:true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null },
  revoked: { type: Boolean, default: false },
  revokedAt: { type: Date, default: null },
  replacedByToken : { type: String, default: null },
  tokenType:  { type: String, default: null },
  userAgent: {
    device: String,
    platform: String,
    os: String,
    browser: String,
    browserVersion: String,
    ip: String
  }
});

// Automatically delete expired tokens
empTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

  // Validate environment variable for collection name
  const EmployeeToken = process.env.EMP_TOKEN;
  if (!EmployeeToken) {
    throw new Error('❌ Missing "EMP_TOKEN" collection in environment variables.');
  }
  const RefreshTokenModel = mongoose.model('EmployeeToken', empTokenSchema, EmployeeToken);
  export default RefreshTokenModel;

