import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio';
  options?: string[];
  required?: boolean;
}

export interface Form {
  _id: string;
  formKey: string;
  version: number;
  title: string;
  description?: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

const API_BASE = 'http://localhost:4000/api/forms';

export const fetchForm = async (id: string): Promise<Form> => {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch form');
  return res.json();
};

export const fetchForms = async (): Promise<Form[]> => {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch forms');
  return res.json();
};

export const createForm = async (form: Partial<Form>): Promise<Form> => {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  if (!res.ok) throw new Error('Failed to create form');
  return res.json();
};

export const updateForm = async ({ id, form }: { id: string; form: Partial<Form> }): Promise<Form> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  if (!res.ok) throw new Error('Failed to update form');
  return res.json();
};

export const fetchLatestForms = async (): Promise<Form[]> => {
  const allForms = await fetchForms();
  const latestMap = new Map<string, Form>();
  for (const form of allForms) {
    const existing = latestMap.get(form.formKey);
    if (!existing || form.version > existing.version) {
      latestMap.set(form.formKey, form);
    }
  }
  return Array.from(latestMap.values());
};

export const fetchFormVersions = async (formKey: string): Promise<Form[]> => {
  const allForms = await fetchForms();
  return allForms.filter(form => form.formKey === formKey).sort((a, b) => b.version - a.version);
};

export const useForm = (id: string) => useQuery({ queryKey: ['form', id], queryFn: () => fetchForm(id), enabled: !!id });
export const useForms = () => useQuery({ queryKey: ['forms'], queryFn: fetchForms });
export const useLatestForms = () => useQuery({ queryKey: ['latestForms'], queryFn: fetchLatestForms });
export const useCreateForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createForm,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['forms'] }),
  });
};
export const useUpdateForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateForm,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['form', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['forms'] });
    },
  });
};
export const useFormVersions = (formKey: string) => useQuery({ queryKey: ['formVersions', formKey], queryFn: () => fetchFormVersions(formKey), enabled: !!formKey }); 