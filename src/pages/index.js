import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { Overview } from 'src/sections/overview/overview-budget';

import { useAuth } from 'src/hooks/useAuth';

const now = new Date();

const Page = () => {
  const auth =useAuth()
  return(
  <>
    <Head>
      <title>
        Overview       </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="xl">
        <Grid
          container
        
          spacing={3}
        >
          <Grid
            xs={10}
            sm={6}
            lg={3}
          >
            <Overview
              name={"Faculty"}
              positive
              sx={{ height: '100%' }}
              value={auth.facultyAll.length}
            />
            </Grid>
           <Grid
            xs={10}
            sm={6}
            lg={3}
          >
            <Overview
              name={"Department"}
              positive
              sx={{ hweight: '100%' }}
              value={auth.departmentAll.length}
            />
          </Grid>
            <Grid
            xs={10}
            sm={6}
            lg={3}
          >
            <Overview
              name={"Course"}
              positive
              sx={{ height: '100%' }}
              value={auth.courseAll.length}
            />
          </Grid>
          <Grid
            xs={10}
            sm={6}
            lg={3}
          >
            <Overview
              name={"venue"}
              positive
              sx={{ height: '100%' }}
              value={auth.venueAll.length}
            />
          </Grid>
         
        
        </Grid>
      </Container>
    </Box>
  </>
);}

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
