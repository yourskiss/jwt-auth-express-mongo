import mongoose from "mongoose";
import { fileSchema } from "./subdocument";
import {
    enumOwnership,
    enumLivingWith,
    enumAddress
} from './enums.js';
 
const addressSchema = new mongoose.Schema({
  employeeId: { type:String, required: true, trim: true },
  addressType: { type: String, enum: enumAddress, default: 'other' },
  ownership: { type: String, enum: enumOwnership, default: 'other' },
  livingWith: { type: String, enum: enumLivingWith, default: 'other' },
  house: { type: String, trim: true, default: null },
  floor: { type: String, trim: true, default: null },
  street: { type: String, trim: true, default: null },
  area: { type: String, trim: true, default: null },
  city: { type: String, trim: true, default: null },
  state: { type: String, trim: true, default: null },
  country: { type: String, trim: true, default: null },
  pincode: { type: String, trim: true, default: null },
  from: { type: Date, default: null },
  to: { type: Date, default: null },
  file: fileSchema,
}, {
    timestamps: true,
    versionKey: false
  });

  // Validate environment variable for collection name
  const EmployeeAddress = process.env.EMP_ADDRESS;
  if (!EmployeeAddress) {
    throw new Error('❌ Missing "EMP_ADDRESS" collection in environment variables.');
  }
  const EmpAddressModel = mongoose.model('EmployeeAddress', addressSchema, EmployeeAddress);
  export default EmpAddressModel;

