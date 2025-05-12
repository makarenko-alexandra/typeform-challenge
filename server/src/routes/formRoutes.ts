import { Router, Request, Response, NextFunction } from 'express';
import { FormModel } from '../models/Form';
import { Form } from '../types/Form';
import { SubmissionModel } from '../models/Submission';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Create a new form
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const form = new FormModel(req.body as Partial<Form>);
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

// Update a form by ID
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedForm = await FormModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedForm) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.json(updatedForm);
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
    const id = uuidv4();
    const submission = new SubmissionModel({
      id,
      formId: req.params.formId,
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