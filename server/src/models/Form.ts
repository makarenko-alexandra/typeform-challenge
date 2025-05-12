import { Schema, model } from 'mongoose';
import { Form } from '../types/Form';

const FormFieldSchema = new Schema({
  name: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, required: true, enum: ['text', 'textarea', 'select', 'checkbox', 'radio'] },
  options: [String],
  required: { type: Boolean, default: false },
});

const FormSchema = new Schema<Form>({
  formKey: { type: String, required: true, index: true },
  version: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String },
  fields: { type: [FormFieldSchema], required: true },
}, {
  timestamps: true,
});

export const FormModel = model<Form>('Form', FormSchema); 