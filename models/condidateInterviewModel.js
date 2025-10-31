import mongoose from "mongoose";
import { enumInterviewStatus, enumIntractionType } from "./enums";
 
const CondidateInterviewSchema = new mongoose.Schema({
            condidateID:{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', require:true },
            round: { type: Number, min: 1, max: 10, default:1 },
            interviewWith: { type: String, enum: enumIntractionType, default: 'other', trim: true },  
            interviewBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
            interviewAt: { type: Date, default: null },
            topics: [{
                  topic: { type: String, default: null },
                  describe:  { type: String,  default: null },
                  rate:{ type:Number, min:1, max:10, default:5 }
            }],
            isCompleted: { type: Boolean, default: false },
            interviewStatus : { type: String, enum: enumInterviewStatus, default: 'in-progress', trim: true  },
            overallRating: { type:Number, min:1, max:10, default:5 },
            finalNotes: { type: String, trim: true, default: null }  
}, {
    timestamps: true,
    versionKey: false
  });

  // Validate environment variable for collection name
  const CondidateInterview = process.env.CONDIDATE_INTERVIEW;
  if (!CondidateInterview) {
    throw new Error('❌ Missing "CONDIDATE_INTERVIEW" collection in environment variables.');
  }
  const CondidateInterviewModel = mongoose.model('CondidateInterview', CondidateInterviewSchema, CondidateInterview);
  export default CondidateInterviewModel;

