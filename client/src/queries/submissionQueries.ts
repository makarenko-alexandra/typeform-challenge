import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Submission {
  id: string;
  formId: string;
  answers: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

const API_BASE = 'http://localhost:4000/api/forms';

export const fetchSubmissions = async (formId: string): Promise<Submission[]> => {
  const res = await fetch(`${API_BASE}/${formId}/submissions`);
  if (!res.ok) throw new Error('Failed to fetch submissions');
  return res.json();
};

export const createSubmission = async ({ formId, answers }: { formId: string; answers: Record<string, string> }): Promise<Submission> => {
  const res = await fetch(`${API_BASE}/${formId}/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers }),
  });
  if (!res.ok) throw new Error('Failed to create submission');
  return res.json();
};

export const useSubmissions = (formId: string) => useQuery({ queryKey: ['submissions', formId], queryFn: () => fetchSubmissions(formId), enabled: !!formId });
export const useCreateSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubmission,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['submissions', variables.formId] });
    },
  });
}; 