import { Document } from 'mongoose';

export interface Submission extends Document {
  id: string;
  formId: string;
  formVersion: number;
  answers: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
} 