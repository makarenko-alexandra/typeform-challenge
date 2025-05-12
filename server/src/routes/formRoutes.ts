import { Router, Request, Response, NextFunction } from 'express';
import { FormModel } from '../models/Form';
import { Form } from '../types/Form';

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

export default router; 