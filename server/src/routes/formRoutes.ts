import { Router, Request, Response, NextFunction } from 'express';
import { FormModel } from '../models/Form';
import { Form } from '../types/Form';
import { SubmissionModel } from '../models/Submission';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Create a new form
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // If formKey is not provided, generate a new one (new logical form)
    const formKey = req.body.formKey || uuidv4();
    // Always start at version 1 for new logical forms
    const version = 1;
    const form = new FormModel({ ...req.body, formKey, version });
    const savedForm = await form.save();
    res.status(201).json(savedForm);
  } catch (error) {
    next(error);
  }
});

// Get all forms
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const forms = await FormModel.find();
    res.json(forms);
  } catch (error) {
    next(error);
  }
});

// Get a single form by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const form = await FormModel.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    next(error);
  }
});

// Update a form by ID (create a new version)
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Find the existing form to get its formKey and latest version
    const existingForm = await FormModel.findById(req.params.id);
    if (!existingForm) {
      return res.status(404).json({ error: 'Form not found' });
    }
    // Find the latest version for this formKey
    const latest = await FormModel.find({ formKey: existingForm.formKey }).sort({ version: -1 }).limit(1);
    const nextVersion = latest.length > 0 ? latest[0].version + 1 : 1;
    // Create a new form document with incremented version
    const newForm = new FormModel({
      ...req.body,
      formKey: existingForm.formKey,
      version: nextVersion,
    });
    const savedForm = await newForm.save();
    res.status(201).json(savedForm);
  } catch (error) {
    next(error);
  }
});

// Delete a form by ID
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedForm = await FormModel.findByIdAndDelete(req.params.id);
    if (!deletedForm) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// --- SUBMISSIONS ENDPOINTS ---

// Create a new submission for a form
router.post('/:formId/submissions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { answers } = req.body;
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Invalid answers' });
    }
    // Find the form to get its version
    const form = await FormModel.findById(req.params.formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    const id = uuidv4();
    const submission = new SubmissionModel({
      id,
      formId: req.params.formId,
      formVersion: form.version,
      answers,
    });
    const savedSubmission = await submission.save();
    res.status(201).json(savedSubmission);
  } catch (error) {
    next(error);
  }
});

// Get all submissions for a form
router.get('/:formId/submissions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const submissions = await SubmissionModel.find({ formId: req.params.formId }).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    next(error);
  }
});

// Get a single submission by ID
router.get('/:formId/submissions/:submissionId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { formId, submissionId } = req.params;
    const submission = await SubmissionModel.findOne({ formId, id: submissionId });
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    res.json(submission);
  } catch (error) {
    next(error);
  }
});

// Update a submission by ID
router.put('/:formId/submissions/:submissionId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { formId, submissionId } = req.params;
    const { answers } = req.body;
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Invalid answers' });
    }
    const updatedSubmission = await SubmissionModel.findOneAndUpdate(
      { formId, id: submissionId },
      { answers },
      { new: true, runValidators: true }
    );
    if (!updatedSubmission) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    res.json(updatedSubmission);
  } catch (error) {
    next(error);
  }
});

export default router; 