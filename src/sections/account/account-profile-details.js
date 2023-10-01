import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { useAuth } from 'src/hooks/useAuth';
import { deletData } from 'src/service/Api';

const states = [
  {
    value: 'alabama',
    label: 'Alabama'
  },
  {
    value: 'new-york',
    label: 'New York'
  },
  {
    value: 'san-francisco',
    label: 'San Francisco'
  },
  {
    value: 'los-angeles',
    label: 'Los Angeles'
  }
];

export const AccountProfileDetails = ({data,handleUpdate}) => {

  
  const auth=useAuth()
  const [user,setUser]=useState(auth.userData)
  const [values, setValues] = useState(data||auth.userData);

  useEffect(() => {
    setValues(data||auth.userData)
    console.log({data,k:auth.userData})
  }, [data||auth?.userData])
  
  const handleChange = useCallback(
    (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );
  const handleDelete = () => {
    // deletData("users",values?.id,handleCloseModal,setReload)
}
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

    },
    []
  );

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      <Card>
        <CardHeader
          subheader="The information can be edited"
          title="Profile"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  helperText="Please specify the first name"
                  label="Full name"
                  name="fullname"
                  onChange={handleChange}
                  required
                  value={values?.fullname}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Matric number"
                  name="matric"
                  onChange={handleChange}
                  required
                  value={values?.matric}
                />
              </Grid>
          
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Department"
                  name="depart"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={values?.depart}
                >
                    <option
                      key={""}
                      value={""}
                    >
                      {""}
                    </option>
                  {auth.departmentAll.map((option) => (
                    <option
                      key={option.department}
                      value={option.department}
                    >
                      {option.department}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
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
                  {['','100', '200', '300', '400', '500','600'].map((option) => (
                    <option
                      key={option}
                      value={option}
                    >
                      {option}
                    </option>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />

        <CardActions  style={{ display: "flex", flexDirection: "row", justifyContent:"space-between" }} >
                    {values?.id ? (

                      <Button color='error'  onClick={handleDelete} variant="contained">
                        Delete
                      </Button>

                    ):<div></div>}

<Button onClick={()=>handleUpdate(values)} variant="contained">
            Save details
          </Button>
                  </CardActions>
        
      </Card>
    </form>
  );
};
