import { Document } from 'mongoose';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio';
  options?: string[];
  required?: boolean;
}

export interface Form extends Document {
  formKey: string;
  version: number;
  title: string;
  description?: string;
  fields: FormField[];
  createdAt: Date;
  updatedAt: Date;
} 