import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { Backdrop, Box, Button, CardActions, CircularProgress, Container, Grid, Modal, Stack, SvgIcon, TextField, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CustomsTable } from 'src/sections/custom/customs-table';
import { CustomsSearch } from 'src/sections/custom/customs-search';
import { addData, deletData, getData, updateData } from 'src/service/Api';
import { useAuth } from 'src/hooks/useAuth';
import { AccountProfileDetails } from 'src/sections/account/account-profile-details';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';




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
  const auth = useAuth()

  const [reload, setReload] = useState();

  const [data, setData] = useState(auth?.facultyAll)
  const [open, setOpen] = useState(true);
  const [adata, setAData] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  let [values, setValues] = useState();
  const handleOpenModal = (data) => {
   
    setAData(data)
     setValues(data)
    setOpenModal(true)
    console.log(values)
  };
  const handleOpenModal1 = (data) => {
   
    setAData(data)
     setValues(data)
    setOpenModal1(true)
    console.log(values)
  };
  // useEffect(() => {
  //  if(openModal===false){
  //   setValues({})
  //  }
  // }, [openModal])
  
  const handleCloseModal = () => {
    // setValues({})
    // values={}
    setOpenModal(false)
    setOpenModal1(false)
  };

  useEffect(() => {
    setValues({})
    const getdatas = async () => {
      const datas = getData("faculty", auth?.setfaculty)
      setData(await datas)
      setOpen(false);
      console.log("first,", await datas)
    }
    getdatas()

  }, [reload])

  const handleUpdate = () => {

if(adata?.id){
  updateData("faculty", {...values,id:adata.id}, handleCloseModal, setReload)
}else{
  addData("faculty", values, handleCloseModal, setReload)
}
  }
  const handleDelete = () => {
    deletData("faculty",adata?.id,handleCloseModal,setReload)
}

  const handleChange = useCallback(
    (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );
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
        Faculty
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
                  Faculty
                </Typography>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  
                </Stack>
              </Stack>
              <div>
              <Button
                    onClick={()=>handleOpenModal1(null)}
                      startIcon={(
                        <SvgIcon fontSize="small">
                          <PlusIcon />
                        </SvgIcon>
                      )}
                      variant="contained"
                    >
                      Add
                    </Button>
              </div>
            </Stack>
            <CustomsSearch main={auth.facultyAll} setData={setData} data={data} keys={'name'} name={"Search faculty"} />
            <CustomsTable
              handleOpenModal={handleOpenModal}
              items={data || []}
              headers={["Faculty"]}
              header2={["name"]}

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
            <Grid container>
              <Grid>
                <TextField
                  fullWidth
                  label="Faculty"
                  name="name"
                  onChange={handleChange}
                  required
                  value={values?.name}
                />

<CardActions  style={{ display: "flex", flexDirection: "row", justifyContent:"space-between" }} >
                    {adata?.id ? (

                      <Button color='error'  onClick={handleDelete} variant="contained">
                        Delete
                      </Button>

                    ):<div></div>}

                    <Button   onClick={handleUpdate} variant="contained">
                      Save details
                    </Button>
                  </CardActions>
              </Grid>
            </Grid>
          </div>
        </Box>
      </Modal>
      <Modal
        keepMounted
        open={openModal1}
        onClose={handleCloseModal}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <div>
            <Grid container>
              <Grid>
                <TextField
                  fullWidth
                  label="Faculty"
                  name="name"
                  onChange={handleChange}
                  required
                  
                />

<CardActions  style={{ display: "flex", flexDirection: "row", justifyContent:"space-between" }} >
                    {adata?.id ? (

                      <Button color='error'  onClick={handleDelete} variant="contained">
                        Delete
                      </Button>

                    ):<div></div>}

                    <Button   onClick={handleUpdate} variant="contained">
                      Save details
                    </Button>
                  </CardActions>
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
