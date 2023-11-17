import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Backdrop, Box, CircularProgress, Container, Grid, Modal, Stack, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CustomsTable } from 'src/sections/custom/customs-table';
import { CustomsSearch } from 'src/sections/custom/customs-search';
import { deletData, getData, updateData } from 'src/service/Api';
import { useAuth } from 'src/hooks/useAuth';
import { AccountProfileDetails } from 'src/sections/account/account-profile-details';




const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};

const Page = () => {
  const auth=useAuth()
  const [page, setPage] = useState(0);
  const [reload, setReload] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(5);
 const [data,setData]=useState(auth.userAll)
 const [open, setOpen] = useState(true);
 const [aUser, setAUser] = useState();
 const [openModal, setOpenModal] = useState(false);
 const handleOpenModal = (data) => {
 
  setAUser(data)
  setOpenModal(true)
};
 const handleCloseModal = () => setOpenModal(false);

 useEffect(() => {
  
  const getusers=async()=>{
   const users= getData("users",auth.setUsers)
   setData(await users)
   setOpen(false);
   console.log("first,", await users)
  }
  getusers()
 
 }, [reload])

const handleUpdate=(dt)=>{

  updateData("users",dt, handleCloseModal,setReload)
  

}

const handleDelete = (dt) => {
  deletData("users",dt.id,handleCloseModal,setReload)
}


  return (
    <>
    <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
     
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Head>
        <title>
          Students 
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                Students 
                </Typography>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                 
                </Stack>
              </Stack>
         
            </Stack>
            <CustomsSearch main={auth.userAll} setData={setData} data={data} keys={'matric'} name={"Search students"} />
            <CustomsTable
              handleOpenModal={handleOpenModal}
              items={data.filter((usr)=>usr.type==='Student')}
              headers={["Matric", "Full name","Department","Level"]}
               header2={["matric", "fullname","depart","level"]}
             
            />
          </Stack>
        </Container>
      </Box>
 <Modal
        keepMounted
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
        <div>
            <Grid
              container
              
            >
              {/* <Grid
                xs={12}
                md={6}
                lg={4}
              >
                <AccountProfile />
              </Grid> */}
              <Grid
                
              >
                <AccountProfileDetails handleDelete={handleDelete} data={aUser} handleUpdate={handleUpdate} />
              </Grid>
            </Grid>
          </div>
        </Box>
      </Modal>

     
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
