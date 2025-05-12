import { Document } from 'mongoose';

export interface Submission extends Document {
  id: string;
  formId: string;
  answers: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
} 