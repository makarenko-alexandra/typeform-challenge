export interface StoredForm {
  id: string;
  questions: string[];
  createdAt: string;
}

function generateUUID(): string {
  // Simple UUID v4 generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function saveForm(questions: string[]): string {
  const id = generateUUID();
  const form: StoredForm = {
    id,
    questions,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(`form:${id}`, JSON.stringify(form));
  return id;
}

export function getForm(id: string): StoredForm | null {
  const data = localStorage.getItem(`form:${id}`);
  if (!data) return null;
  try {
    return JSON.parse(data) as StoredForm;
  } catch {
    return null;
  }
}

export function listForms(): Array<{ id: string; createdAt: string }> {
  const forms: Array<{ id: string; createdAt: string }> = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('form:')) {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsed = JSON.parse(data) as StoredForm;
          forms.push({ id: parsed.id, createdAt: parsed.createdAt });
        } catch {}
      }
    }
  }
  return forms;
} 