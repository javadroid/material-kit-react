import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Autocomplete, Box, Button, Link, Stack, TextField, Typography } from '@mui/material';

import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import { signup } from 'src/service/Api';
import { useAuth } from 'src/hooks/useAuth';


const Page = () => {
  const router = useRouter();
  const auth = useAuth()
  const formik = useFormik({
    initialValues: {
      matric: 'admin',
      name: 'admin',
      user: 'admin',
      password: 'admin',
      department: 'admin',
      level: 'admin',
      submit: null
    },
    validationSchema: Yup.object({
      matric: Yup
        .string()

        .max(255)
        .required('Matric is required'),
      name: Yup
        .string()
        .max(255)
        .required('Name is required'),
      user: Yup
        .string()
        .max(255)
        .required('User type is required'),
      department: Yup
        .string()
        .max(255)
        .required('Department is required'),

      password: Yup
        .string()
        .max(255)
        .required('Password is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
        await signup(values.matric, values.password, values.department, values.level, values.name, values.user, router, helpers, auth);

       
        // router.push('/');
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  return (
    <>
      <Head>
        <title>
          Register
        </title>
      </Head>
      <Box
        sx={{
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%'
          }}
        >
          <div>
            <Stack
              spacing={1}
              sx={{ mb: 3 }}
            >
              <Typography variant="h4">
                Register
              </Typography>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Already have an account?
                &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/login"
                  underline="hover"
                  variant="subtitle2"
                >
                  Log in
                </Link>
              </Typography>
            </Stack>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  name="user"
                  onChange={formik.handleChange}
                  select
                  helperText={formik.touched.user && formik.errors.user}
                  error={!!(formik.touched.user && formik.errors.user)}
                  SelectProps={{ native: true }}
                  value={formik.values.user}
                >
                  {[null, 'Student', 'Lecturer','Admin'].map((option) => (
                    <option
                      key={option}
                      value={option}
                    >
                      {option}
                    </option>
                  ))}
                </TextField>


                <TextField
                  error={!!(formik.touched.matric && formik.errors.matric)}
                  fullWidth
                  helperText={formik.touched.matric && formik.errors.matric}
                  label="Matric / Staff id"
                  name="matric"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="matric"
                  value={formik.values.matric}
                />
                <TextField
                  error={!!(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label="Full name"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />

                <TextField
                  id="combo-box-demo"
                  fullWidth
                  name="department"
                   label="Department"
                  select
                  SelectProps={{ native: true }}
                  helperText={formik.touched.department && formik.errors.department}
                  error={!!(formik.touched.department && formik.errors.department)}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.department}
                >
                  {['',...auth.departmentAll.map((dept)=>dept["department"])].map((option) => (
                    <option
                      key={option}
                      value={option}
                    >
                      {option}
                    </option>
                  ))}
                </TextField>

                {
                  formik.values.user === 'Student' ? <TextField
                    id="combo-box-demo"
                    select
                    SelectProps={{ native: true }}
                    fullWidth
                    name="level"
                    label="Level"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                 

                    value={formik.values.level}
                  >
                    {['','100', '200', '300', '400', '500','600'].map((option) => (
                      <option
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>
                    ))}
                  </TextField> : <>
                  </>
                }


                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
              </Stack>
              {formik.errors.submit && (
                <Typography
                  color="error"
                  sx={{ mt: 3 }}
                  variant="body2"
                >
                  {formik.errors.submit}
                </Typography>
              )}
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
              >
                Continue
              </Button>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <AuthLayout>
    {page}
  </AuthLayout>
);

export default Page;
