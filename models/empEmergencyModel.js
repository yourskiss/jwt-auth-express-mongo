import mongoose from "mongoose"; 
 
const empEmergencySchema = new mongoose.Schema({
  employeeId: { type:String, required: true, trim: true },
  relation: { type: String, enum: enumRelation, default: 'other', trim: true },
  name: { type: String, trim: true },
  phone:  { type: String, trim: true,  match: /^[6-9]\d{9}$/ },
  phoneAlt:  { type: String, trim: true,  match: /^[6-9]\d{9}$/ },
  email:  { type: String, trim: true, lowercase: true, match: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/ },
  address: { type: String, trim: true },
  notes: { type: String, trim: true }
}, {
    timestamps: true,
    versionKey: false
  });

  // Validate environment variable for collection name
  const EmployeeEmergency = process.env.EMP_EMERGENCY;
  if (!EmployeeEmergency) {
    throw new Error('❌ Missing "EMP_EMERGENCY" collection in environment variables.');
  }
  const EmpEmergencyModel = mongoose.model('EmployeeEmergency', empEmergencySchema, EmployeeEmergency);
  export default EmpEmergencyModel;

