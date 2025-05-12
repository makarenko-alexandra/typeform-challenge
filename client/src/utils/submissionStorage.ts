export interface Submission {
  id: string;
  formId: string;
  answers: Record<string, string>;
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

export function saveSubmission(formId: string, answers: Record<string, string>): string {
  const id = generateUUID();
  const submission: Submission = {
    id,
    formId,
    answers,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(`submission:${formId}:${id}`, JSON.stringify(submission));
  return id;
}

export function listSubmissions(formId: string): Submission[] {
  const submissions: Submission[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(`submission:${formId}:`)) {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsed = JSON.parse(data) as Submission;
          submissions.push(parsed);
        } catch {}
      }
    }
  }
  // Sort by createdAt descending
  submissions.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return submissions;
} 