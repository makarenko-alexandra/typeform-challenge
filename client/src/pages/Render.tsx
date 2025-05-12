import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Title, Stack, Text, Button, TextInput, Paper, Group, Code } from '@mantine/core';
import { useFormik } from 'formik';
import { useForm as useFormQuery } from '../queries/formQueries';
import { useSubmissions, useCreateSubmission } from '../queries/submissionQueries';
import type { Submission } from '../queries/submissionQueries';

const Render: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: form, isLoading: formLoading, isError: formError } = useFormQuery(id || '');
  const { data: submissions = [], isLoading: submissionsLoading } = useSubmissions(id || '');
  const createSubmission = useCreateSubmission();

  const initialValues = React.useMemo(() => {
    if (!form) return {};
    return form.fields.reduce<Record<string, string>>((acc, field, idx) => {
      acc[field.name || String(idx)] = '';
      return acc;
    }, {});
  }, [form]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: async (values, { resetForm }) => {
      if (!id) return;
      await createSubmission.mutateAsync({ formId: id, answers: values });
      resetForm();
    },
  });

  if (formLoading) {
    return (
      <Box maw={500} mx="auto" mt="xl" p="md">
        <Text>Loading form...</Text>
      </Box>
    );
  }

  if (formError || !form) {
    return (
      <Box maw={500} mx="auto" mt="xl" p="md">
        <Title order={2} c="red">Form not found</Title>
        <Text color="dimmed">No form exists for the provided ID.</Text>
      </Box>
    );
  }

  return (
    <Box maw={500} mx="auto" mt="xl" p="md">
      <Title order={1} mb="md">Form Renderer</Title>
      <Text mb="md" color="dimmed">Form ID: {form._id}</Text>
      <form onSubmit={formik.handleSubmit}>
        <Stack gap="xs">
          {form.fields.length === 0 ? (
            <Text color="dimmed">No questions in this form.</Text>
          ) : (
            form.fields.map((field, idx) => (
              <TextInput
                key={field.name || idx}
                label={field.label}
                name={field.name || String(idx)}
                value={formik.values[field.name || String(idx)] || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-label={field.label}
                required={field.required}
              />
            ))
          )}
        </Stack>
        <Button
          type="submit"
          mt="xl"
          fullWidth
          disabled={form.fields.length === 0}
          aria-label="Submit answers"
          loading={createSubmission.isPending}
        >
          Submit
        </Button>
      </form>
      <Title order={3} mt="xl" mb="sm">Submissions</Title>
      {submissionsLoading ? (
        <Text color="dimmed">Loading submissions...</Text>
      ) : submissions.length === 0 ? (
        <Text color="dimmed">No submissions yet.</Text>
      ) : (
        <Stack gap="sm">
          {submissions.map((sub: Submission) => (
            <Paper key={sub.id} withBorder p="md" radius="md">
              <Group justify="space-between" mb="xs">
                <Text size="sm" color="dimmed">ID: <Code>{sub.id}</Code></Text>
                <Text size="sm" color="dimmed">{new Date(sub.createdAt).toLocaleString()}</Text>
              </Group>
              <Stack gap={4}>
                {form.fields.map((field, idx) => (
                  <Text key={field.name || idx} size="sm">
                    <b>{field.label}:</b> {sub.answers[field.name || String(idx)] || <i>(empty)</i>}
                  </Text>
                ))}
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default Render; 