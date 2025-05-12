import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Stack, Title, TextInput, Button, Text, Paper, Group, Code } from '@mantine/core';
import Question from '../components/Question';
import {
  useForm as useFormQuery,
  useForms,
  useCreateForm,
  useUpdateForm,
} from '../queries/formQueries';
import type { Form as ApiFormType } from '../queries/formQueries';

const Builder: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [notFound, setNotFound] = useState(false);

  const { data: form, isLoading: formLoading, isError: formError } = useFormQuery(id || '');
  const { data: forms = [], isLoading: formsLoading } = useForms();
  const createForm = useCreateForm();
  const updateForm = useUpdateForm();

  useEffect(() => {
    if (id) {
      if (form) {
        setQuestions(form.fields.map(f => f.label));
        setTitle(form.title || '');
        setNotFound(false);
      } else if (!formLoading && formError) {
        setQuestions([]);
        setTitle('');
        setNotFound(true);
      }
    } else {
      setQuestions([]);
      setTitle('');
      setNotFound(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, form, formLoading, formError]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleAddQuestion = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;
    setQuestions((prev) => [...prev, trimmed]);
    setQuestion('');
  };

  const handleSaveClick = async () => {
    const fields = questions.map((q, idx) => ({
      name: `q${idx}`,
      label: q,
      type: 'text' as const,
    }));
    if (id && form) {
      await updateForm.mutateAsync({ id, form: { title, fields } });
    } else {
      const created = await createForm.mutateAsync({ title, fields });
      navigate(`/builder/${created._id}`);
    }
  };

  if (notFound) {
    return (
      <Box maw={500} mx="auto" mt="xl" p="md">
        <Title order={2} c="red">Form not found</Title>
        <Text color="dimmed">No form exists for the provided ID.</Text>
      </Box>
    );
  }

  return (
    <Box maw={500} mx="auto" mt="xl" p="md">
      <Title order={1} mb="md" tabIndex={0}>
        Form Builder
      </Title>
      <TextInput
        value={title}
        onChange={handleTitleChange}
        label="Form Title"
        placeholder="Enter form title"
        name="title"
        required
        mb="md"
        aria-label="Form title input"
      />
      <Box component="form" onSubmit={handleAddQuestion} aria-label="Add question form">
        <Stack>
          <TextInput
            value={question}
            onChange={handleInputChange}
            label="Question"
            placeholder="Enter your question"
            name="question"
            required
            autoFocus
            aria-label="Question input"
            data-autofocus
          />
          <Button type="submit" disabled={!question.trim()} aria-label="Add question">
            Add
          </Button>
        </Stack>
      </Box>
      <Title order={2} mt="xl" mb="sm" tabIndex={0}>
        Questions
      </Title>
      {questions.length === 0 ? (
        <Text color="dimmed">No questions added yet.</Text>
      ) : (
        <Stack gap="xs" aria-label="List of questions">
          {questions.map((q, idx) => (
            <Question key={idx} title={q} value="" />
          ))}
        </Stack>
      )}
      <Button
        mt="xl"
        fullWidth
        disabled={questions.length === 0 || !title.trim()}
        aria-label="Save questions"
        onClick={handleSaveClick}
        loading={createForm.isPending || updateForm.isPending}
      >
        Save
      </Button>
      <Title order={3} mt="xl" mb="sm">All Forms</Title>
      {formsLoading ? (
        <Text color="dimmed">Loading forms...</Text>
      ) : forms.length === 0 ? (
        <Text color="dimmed">No forms created yet.</Text>
      ) : (
        <Stack gap="sm">
          {forms.map((form: ApiFormType) => (
            <Paper key={form._id} withBorder p="md" radius="md" onClick={() => navigate(`/render/${form._id}`)} style={{ cursor: 'pointer' }}>
              <Group justify="space-between">
                <Text size="sm">ID: <Code>{form._id}</Code></Text>
                <Text size="sm" color="dimmed">{new Date(form.createdAt).toLocaleString()}</Text>
              </Group>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default Builder; 