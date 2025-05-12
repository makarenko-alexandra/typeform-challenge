import { Schema, model } from 'mongoose';
import { Submission } from '../types/Submission';

const SubmissionSchema = new Schema<Submission>({
  id: { type: String, required: true, unique: true },
  formId: { type: String, required: true, index: true },
  formVersion: { type: Number, required: true },
  answers: { type: Map, of: String, required: true },
}, {
  timestamps: true,
});

export const SubmissionModel = model<Submission>('Submission', SubmissionSchema); 