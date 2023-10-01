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
  const [data, setData] = useState(auth?.courseAll)
  const [open, setOpen] = useState(true);
  const [adata, setAData] = useState();
  const [openModal, setOpenModal] = useState(false);
  let [values, setValues] = useState();
  const handleOpenModal = (data) => {
    setAData(data)
    values=null
    setValues(data)
    setOpenModal(true)
    console.log(data)
  };
  const handleCloseModal = () => setOpenModal(false);

  useEffect(() => {
    setValues()
    const getdatas = async () => {
      const datas = getData("course", auth?.setcourse)
      setData(await datas)
      setOpen(false);
      // console.log("first,", await datas)
    }
    getdatas()

  }, [reload])

  const handleUpdate = () => {
    console.log({ values, f: auth.departmentAll })
    if (adata?.id) {
      updateData("course", { ...values, id: adata.id }, handleCloseModal, setReload)
    } else {
      addData("course", values, handleCloseModal, setReload)
    }
  }

  const handleDelete = () => {
    deletData("course",adata?.id,handleCloseModal,setReload)
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
          Courses
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
                Courses
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
                  onClick={() => handleOpenModal(null)}
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
            <CustomsSearch auth={auth} main={auth.courseAll} setData={setData} data={data} keys={'code'} name={"Search course"} />
            
            <CustomsTable
              handleOpenModal={handleOpenModal}
              items={data || []}
              headers={["name", "code", "unit", "department", "level", "no of students"]}
              header2={["name", "code", "unit", "department", "level", "student"]}

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
                <TextField
                  fullWidth
                  label="Code"
                  name="code"
                  onChange={handleChange}
                  required
                  value={values?.code}
                />
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  onChange={handleChange}
                  required
                  value={values?.name}
                />
                <TextField
                  fullWidth
                  label="Unit"
                  name="unit"
                  type='number'
                  onChange={handleChange}
                  required
                  value={values?.unit}
                />
                <TextField
                  fullWidth
                  label="Nunber of students"
                  name="student"
                  type='number'
                  onChange={handleChange}
                  required
                  value={values?.course}
                />
                <TextField
                  fullWidth
                  label="Department"
                  name="eman"
                  onChange={(e) => {
                    const aas = JSON.parse(e.target.value)
                      const vs={...values}
                      vs["falcuty"] = aas?.faculty
                      vs["department"] = aas?.department
                      setValues((prevState) => ({
                        ...prevState,
                        ...vs
                      }))
                    // handleChange(e)
                  }}
                  required
                  select
                  SelectProps={{ native: true }}
                  // value={values?.faculty}
                >
                  <option

                    key={"option.department"}
                    value={"[]"}
                  >
                    {""}
                  </option>
                  {auth.departmentAll?.map((option) => (
                    <option

                      key={option.department}
                      value={JSON.stringify(option)}
                    >
                      {option.department}
                    </option>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  label="Level"
                  name="level"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={values?.level}
                >
                  {["", 100, 200, 300, 400, 500, 600].map((option) => (
                    <option

                      key={option}
                      value={option}
                    >
                      {option}
                    </option>
                  ))}
                </TextField>

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
