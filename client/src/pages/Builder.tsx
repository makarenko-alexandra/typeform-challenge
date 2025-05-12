import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Stack, Title, TextInput, Button, Text, Paper, Group, Code, ActionIcon, Divider, Tooltip } from '@mantine/core';
import Question from '../components/Question';
import {
  useForm as useFormQuery,
  useForms,
  useCreateForm,
  useUpdateForm,
} from '../queries/formQueries';
import type { Form as ApiFormType } from '../queries/formQueries';
import { notifications } from '@mantine/notifications';
import { IconPencil, IconEye } from '@tabler/icons-react';

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
    if (id && form) {
      setQuestions(form.fields.map(f => f.label));
      setTitle(form.title || '');
      setNotFound(false);
    } else if (id && !formLoading && formError) {
      setQuestions([]);
      setTitle('');
      setNotFound(true);
    } else if (!id) {
      setQuestions([]);
      setTitle('');
      setNotFound(false);
    }
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

  const handleRemoveQuestion = (idx: number) => {
    setQuestions(qs => qs.filter((_, i) => i !== idx));
  };

  const handleSaveClick = async () => {
    const fields = questions.map((q, idx) => ({
      name: `q${idx}`,
      label: q,
      type: 'text' as const,
    }));
    if (id && form) {
      const updated = await updateForm.mutateAsync({ id, form: { title, fields } });
      navigate(`/builder/${updated._id}`);
      notifications.show({
        title: 'Form Saved',
        message: `Saved as version v${updated.version}`,
        color: 'green',
      });
    } else {
      const created = await createForm.mutateAsync({ title, fields });
      navigate(`/builder/${created._id}`);
      notifications.show({
        title: 'Form Created',
        message: `Created as version v${created.version}`,
        color: 'green',
      });
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
            <Question
              key={idx}
              title={q}
              value=""
              readonly={true}
              onRemove={() => handleRemoveQuestion(idx)}
              onTitleChange={newTitle => setQuestions(qs => qs.map((old, i) => i === idx ? newTitle : old))}
            />
          ))}
        </Stack>
      )}
      <Button
        mt="xl"
        fullWidth
        disabled={questions.length === 0 || !title.trim() || createForm.isPending || updateForm.isPending}
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
        <Stack gap="lg">
          {Array.from(
            forms.reduce((acc, form) => {
              if (!acc.has(form.formKey)) acc.set(form.formKey, []);
              acc.get(form.formKey)!.push(form);
              return acc;
            }, new Map()),
          ).map(([formKey, group], idx, arr) => {
            // Sort versions descending
            const sorted = [...group].sort((a, b) => b.version - a.version);
            const latest = sorted[0];
            return (
              <Paper key={formKey} withBorder p="md" radius="md" shadow="sm">
                <Group justify="space-between" align="center" mb="xs">
                  <div>
                    <Text size="lg" fw={700}>{latest.title}</Text>
                    <Text size="xs" color="dimmed">Form Key: {formKey}</Text>
                  </div>
                </Group>
                <Divider mb="xs" />
                <Stack gap={0}>
                  <Group px="xs" py={4} style={{ fontWeight: 600, fontSize: 14, color: '#666' }}>
                    <Text w={80}>Version</Text>
                    <Text w={180}>Created</Text>
                    <Text w={220}>Form ID</Text>
                    <Text w={100}>Actions</Text>
                  </Group>
                  {sorted.map((form) => (
                    <Group key={form._id} px="xs" py={6} style={{ background: '#fafbfc', borderRadius: 6, marginBottom: 4 }}>
                      <Text w={80}>v{form.version}</Text>
                      <Text w={180} size="xs" color="dimmed">{new Date(form.createdAt).toLocaleString()}</Text>
                      <Text w={220} size="xs" color="dimmed" style={{ wordBreak: 'break-all' }}><Code>{form._id}</Code></Text>
                      <Group w={100} gap={8}>
                        <Tooltip label="Edit this version" withArrow>
                          <ActionIcon
                            variant="light"
                            color="blue"
                            aria-label="Edit form"
                            tabIndex={0}
                            onClick={e => {
                              e.stopPropagation();
                              navigate(`/builder/${form._id}`);
                            }}
                          >
                            <IconPencil size={18} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Render this version" withArrow>
                          <ActionIcon
                            variant="light"
                            color="teal"
                            aria-label="Render form"
                            tabIndex={0}
                            onClick={e => {
                              e.stopPropagation();
                              navigate(`/render/${form._id}`);
                            }}
                          >
                            <IconEye size={18} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Group>
                  ))}
                </Stack>
                {idx < arr.length - 1 && <Divider mt="md" />}
              </Paper>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};

export default Builder; 