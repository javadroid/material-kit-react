import Head from 'next/head';
import { Box, Autocomplete, CircularProgress, Backdrop, Container, TextField, Button, Stack, Typography, InputLabel } from '@mui/material';
import { SettingsNotifications } from 'src/sections/settings/settings-notifications';
import { SettingsPassword } from 'src/sections/settings/settings-password';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useEffect, useState } from 'react';
import { useAuth } from 'src/hooks/useAuth';
import play from 'play';
import { useRouter } from 'next/router';

const Page = () => {
  const auth = useAuth()
  const [dep, setdep] = useState()
  const [loading, setloading] = useState(false)
  const [fac, setfac] = useState()
  const [semester, setsemester] = useState(1)
  const [courseAll, setcourseAll] = useState(auth.courseAll)
  const [main, setmain] = useState(auth.courseAll)
  const [level, setLevel] = useState()
  const [invigilator, setinvigilator] = useState(0)
  const [weeks, setweeks] = useState(1)
  const [buttonText, setbuttonText] = useState("Generate General Exam Timetable")

  const router = useRouter();
  useEffect(() => {

    console.log("first", auth.courseAll)
  }, [])

  const handleGenerate = () => {
    setloading(true)
    let nC = auth.courseAll
    let Venue = auth.venueAll
    let Lct = auth.userAll?.filter((usr) => usr.type === 'Lecturer')
    Venue.map((d, i) => {

      d.venueName = d.venue
      d.venueCode = d.code
    })

    Lct?.map((d, i) => {

      d.department = d.depart
      d.lecturerName = d.fullname
    })
    nC.map((d, i) => {
      d.faculty = d.falcuty
      d.course = d.code
      d.department = d.department
      d.creditHours = d.unit
      d.students = d.student
      d.semester = d.semester
    })
    let newCourse



    if (fac && !dep) {
      newCourse = nC.filter(data =>
        data.falcuty.includes(fac)
        && data.semester?.includes(semester))

    } else if (fac && level) {
      newCourse = nC.filter(data =>
        data.falcuty.includes(fac)
        && data.semester?.includes(semester)
        && data.level.includes(level))
    } else if (dep && level) {
      newCourse = nC.filter(data =>

        data.department.includes(dep)
        && data.level.includes(level)
        && data.semester?.includes(semester))
    } else if (dep) {
      newCourse = nC.filter(data =>
        data.department.includes(dep)
        && data.semester?.includes(semester))
    } else {
      console.log("newCoursedsfd")
      newCourse = newCourse = nC
        .filter(data => data.semester?.includes(semester))
    }
    
    let Venue1=Venue

    Venue1.map((d,i)=>{
      d.venueCode=d.venueCode+i.toString()

    })
    let Venue2=Venue1

    Venue2.map((d,i)=>{
      d.venueCode=d.venueCode+i.toString()

    })
    let Venue1111=[...Venue,...Venue1,...Venue2]

    // console.log("newCourse", Venue,newCourse,weeks,Lct,invigilator)
    setTimeout(() => {
      setloading(false)
      play(Venue1111, newCourse, weeks, Lct, invigilator, auth?.setexamWeeksAll)
      router.push('/ViewETG');
      // window.location.href="/"
    }, 5000)


  }

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}

      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Head>
        <title>
          Settings
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Typography variant="h4">
              Settings
            </Typography>
            <div>

              <InputLabel    >Numbers of Weeks to write exam</InputLabel>
              <TextField value={weeks} onChange={(e) => setweeks(e.target.value)} />
              <br />
              <br />
              <InputLabel    >Select semester </InputLabel>

              <Autocomplete
                disablePortal
                id="combo-box-demo"
                value={fac}
                onChange={(e, w) => {
                  setsemester(w)
                }
                }
                options={["", 1, 2]}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Semester" />}
              /><br />
               <InputLabel    >Numbers of invigilator per exam</InputLabel>
              <TextField value={invigilator} onChange={(e) => setinvigilator(e.target.value)} />
              <br />
              <br />
              {/*
              <InputLabel    >Generate for a facullty {"(optional)"}</InputLabel>

              <Autocomplete
                disablePortal
                id="combo-box-demo"
                value={fac}
                onChange={(e, w) => {
                  setfac(w)
                  if (w) {
                    setbuttonText("Generate for faculty of " + w)
                  } else {
                    setbuttonText("Generate General Exam Timetable")
                  }


                }
                }
                options={["", ...auth?.facultyAll?.map(obj => obj['name'])]}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Faculty" />}
              /><br />
              <InputLabel    >Generate for a department {"(optional)"}</InputLabel>

              <Autocomplete
                disablePortal
                value={dep}
                onChange={(e, w) => {
                  setdep(w)
                  if (w) {
                    setbuttonText("Generate for " + w)
                  } else {
                    if (fac) {
                      setbuttonText("Generate for faculty of " + fac)
                    } else {
                      setbuttonText("Generate General Exam Timetable")
                    }

                  }
                }}
                id="combo-box-demo"
                options={["", ...auth?.departmentAll.filter((dd) => dd['faculty']?.includes(fac)).map(obj => obj['department'])]}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Department" />}
              />
              <br /> */}
              {/* <InputLabel    >Generate for a level {"(optional)"}</InputLabel>

              <Autocomplete
                disablePortal
                id="combo-box-demo"

                onChange={(e, w) => {
                  console.log(dep, fac)
                  setLevel(w)
                  if (w) {
                  
                      setbuttonText("Generate for " + w + " level")
                    

                  } else {
                    
                      setbuttonText("Generate for " + w + " level")
                    
                  }
                }
                }
                options={["", "100", "200", "300", "400", "500", "600"]}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Level" />}
              />
              <br /> */}


              <Button onClick={handleGenerate} variant="contained">{buttonText}</Button>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );

}
Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
