import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  token: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null },
  revoked: { type: Boolean, default: false },
  revokedAt: { type: Date, default: null },
  replacedByToken : { type: String, default: null },
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
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshTokeModel = mongoose.model("RefreshTokeModel", refreshTokenSchema);

export default RefreshTokeModel;
