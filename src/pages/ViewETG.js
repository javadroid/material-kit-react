import play from 'play'
import React, { useEffect, useRef, useState } from 'react'
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Autocomplete, Button, Card, InputAdornment, OutlinedInput, SvgIcon, TextField, Backdrop, CircularProgress } from '@mui/material';
import { useAuth } from 'src/hooks/useAuth';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { getData } from 'src/service/Api';

export default function ViewETG() {
  const auth = useAuth()
  const [examWeeks, setexamWeeks] = useState(auth.examWeeks)
  const [MainWeek, setMainWeek] = useState(auth.examWeeks)
  const [weekINDEX, setweekINDEX] = useState(0)
  const [dep, setdep] = useState()
  const [level, setlevel] = useState()
  const [showall, setshowall] = useState(false)
  const [userData, setuserData] = useState(auth.userData)
  const [loading, setloading] = useState(true)
  const [fac, setfac] = useState()
  const sud = JSON.parse( localStorage.getItem("userData"))

  useEffect(() => {
    // grtExam()

    const getdatas = async () => {
      const datas = await getData("TimeTable", auth?.setexamWeeksAll)
      setexamWeeks(await JSON.parse(datas[datas.length - 1].examWeeks))
      setMainWeek(await JSON.parse(datas[datas.length - 1].examWeeks))
      setuserData(auth.userData)
      setloading(false);
      console.log("first,", JSON.parse(datas[datas.length - 1].examWeeks))
    }
    getdatas()
  }, [])

  const grtExam = async () => {
    setexamWeeks(auth.examWeeks)
    setloading(false)
    console.log("first", { first: auth.examWeeks })
  }
  const examDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const nextWeek = (i) => {
    console.log("index", i, weekINDEX)
    if (weekINDEX + 1 < i)
      setweekINDEX(weekINDEX + 1)
  }
  const preWeek = (i) => {
    if (weekINDEX > 0)
      setweekINDEX(weekINDEX - 1)
  }


  const printableDivRef = useRef(null);
  const printableDivRef2 = useRef(null);
  const handlePrint = () => {
    const printableContent = printableDivRef2.current;

    if (printableContent) {
       setshowall(true)
      const printWindow = window.open('', '_blank');
      printWindow.document.write('<html><head><title>Print</title></head><body>');
      printWindow.document.write(printableContent.innerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();

       // Print and close the new window
       
      //  printWindow.close();
        setshowall(false)
       // Hide the div again
      //  printableContent.style.display = 'none';
    }
  };

  const handlePrint1 = async() => {
    const printableContent = printableDivRef.current;

    if (printableContent) {
      await setshowall(true)
      const printWindow = window.open('', '_blank');
      printWindow.document.write('<html><head><title>Print</title></head><body>');
      printWindow.document.write(printableContent.innerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      await  printWindow.print();

      // printWindow.close();
      setshowall(false)
    }
  };
  if(sud?.type==="Admin"){
    return (
      <>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
  
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <DashboardLayout>
  
          {!examWeeks || examWeeks.length === 0 ? (
            <>
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", }}>
  
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  value={fac}
                  onChange={(e, w) => {
                    setfac(w)
  
                  }
                  }
                  options={["", ...auth?.facultyAll?.map(obj => obj['name'])]}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Faculty" />}
                />
  
                <Autocomplete
                  disablePortal
                  value={dep}
                  onChange={(e, w) => {
                    setdep(w)
                   
                  }}
                  id="combo-box-demo"
                  options={["", ...auth?.departmentAll.filter((dd) => dd['faculty']?.includes(fac)).map(obj => obj['department'])]}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Department" />}
                />
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
  
                  onChange={(e, w) => {
                    console.log(dep, fac)
                    setlevel(w)
                  }
                  }
                  options={["", "100", "200", "300", "400", "500", "600"]}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Level" />}
                />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "50%" }}>
  
                  <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", width: "50%" }}>
                    <span onClick={() => preWeek(examWeeks.length)}>{"<<prev"}</span>
                    <h4 style={{}}>Week {0}</h4>
                    <span onClick={() => nextWeek(examWeeks.length)}>{"next>>"}</span>
                  </div>
                </div>
                {/* <Button onClick={()=>{}} variant="contained">{"Save"}</Button> */}
              </div>
              <div>No Time Table Generated</div>
            </>
  
          ) : (
            <div  ref={printableDivRef2} style={{ display: "flex", flexDirection: "column" }}>

              {showall?(
                <>
                {examWeeks?.map((week, weekIndex) => (
  
  
    
        <>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", }}>

            <Autocomplete
              disablePortal
              id="combo-box-demo"
              value={fac}
              onChange={(e, w) => {
                setfac(w)
              }
              }
              options={["", ...auth?.facultyAll?.map(obj => obj['name'])]}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Faculty" />}
            />

            <Autocomplete
              disablePortal
              value={dep}
              onChange={(e, w) => {
                setdep(w)
                // setlevel(w)

              }}
              id="combo-box-demo"
              options={["", ...auth?.departmentAll.filter((dd) => dd['faculty']?.includes(fac)).map(obj => obj['department'])]}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Department" />}
            />
            <Autocomplete
              disablePortal
              id="combo-box-demo"

              onChange={(e, w) => {
                console.log(dep, fac)
                setlevel(w)
              }
              }
              options={["", "100", "200", "300", "400", "500", "600"]}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Level" />}
            />

            <Button  title='Print' onClick={handlePrint}>Print</Button>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "50%" }}>

              <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", width: "50%" }}>
                <span onClick={() => preWeek(examWeeks.length)}>{"<<prev"}</span>
                <h4 style={{}}>Week {weekIndex + 1}/{examWeeks.length}</h4>
                <span onClick={() => nextWeek(examWeeks.length)}>{"next>>"}</span>
              </div>
            </div>
            {/* <Button onClick={()=>{}} variant="contained">{"Save"}</Button> */}
          </div>
          <div style={{ width: "100%", display: "flex", background: '#f2f2f2', }}>
            <div style={{ display: "flex", flexDirection: "column", }}>
              {
                examDays.map((day, dayIndex) => (
                  <div key={dayIndex} style={{ height: 170, display: "flex", alignItems: "center" }}>

                    <div style={{ width: 150, background: '#f2f2f2', textAlign: "center" }}>
                      {day}
                    </div>

                    <div style={{ display: "flex", flexDirection: "row" }}>
                      {week
                        .filter(exam => exam.day === day && exam.department.includes(dep||"") && exam.level.toString().includes(level||""))
                        .map((exam, examIndex) => (
                          <ExamCard key={examIndex} exam={exam} />
                        ))}
                    </div>
                  </div>
                ))
              }

            </div>



          </div>
        </>

    
  



))}
                </>
              ):(
                <>
                {examWeeks?.map((week, weekIndex) => (
  
  <>

    {
      weekIndex === weekINDEX && (
        <>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", }}>

            <Autocomplete
              disablePortal
              id="combo-box-demo"
              value={fac}
              onChange={(e, w) => {
                setfac(w)
              }
              }
              options={["", ...auth?.facultyAll?.map(obj => obj['name'])]}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Faculty" />}
            />

            <Autocomplete
              disablePortal
              value={dep}
              onChange={(e, w) => {
                setdep(w)
                // setlevel(w)

              }}
              id="combo-box-demo"
              options={["", ...auth?.departmentAll.filter((dd) => dd['faculty']?.includes(fac)).map(obj => obj['department'])]}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Department" />}
            />
            <Autocomplete
              disablePortal
              id="combo-box-demo"

              onChange={(e, w) => {
                console.log(dep, fac)
                setlevel(w)
              }
              }
              options={["", "100", "200", "300", "400", "500", "600"]}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Level" />}
            />

            <Button  title='Print' onClick={handlePrint}>Print</Button>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "50%" }}>

              <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", width: "50%" }}>
                <span onClick={() => preWeek(examWeeks.length)}>{"<<prev"}</span>
                <h4 style={{}}>Week {weekIndex + 1}/{examWeeks.length}</h4>
                <span onClick={() => nextWeek(examWeeks.length)}>{"next>>"}</span>
              </div>
            </div>
            {/* <Button onClick={()=>{}} variant="contained">{"Save"}</Button> */}
          </div>
          <div style={{ width: "100%", display: "flex", background: '#f2f2f2', }}>
            <div style={{ display: "flex", flexDirection: "column", }}>
              {
                examDays.map((day, dayIndex) => (
                  <div key={dayIndex} style={{ height: 170, display: "flex", alignItems: "center" }}>

                    <div style={{ width: 150, background: '#f2f2f2', textAlign: "center" }}>
                      {day}
                    </div>

                    <div style={{ display: "flex", flexDirection: "row" }}>
                      {week
                        .filter(exam => exam.day === day && exam.department.includes(dep||"") && exam.level.toString().includes(level||""))
                        .map((exam, examIndex) => (
                          <ExamCard key={examIndex} exam={exam} />
                        ))}
                    </div>
                  </div>
                ))
              }

            </div>



          </div>
        </>

      )
    }
  </>



))}
                </>)
              }
              
            </div>
          )}
  
        </DashboardLayout>
      </>
  
  
    );
  }else{
    return (
      <>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
  
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <DashboardLayout>
  

          {
            showall?(<>
            {!examWeeks || examWeeks.length === 0 ? (
            <>
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", }}>
  
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  value={fac}
                  onChange={(e, w) => {
                    setfac(w)
  
                  }
                  }
                  options={["", ...auth?.facultyAll?.map(obj => obj['name'])]}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Faculty" />}
                />
  
                <Autocomplete
                  disablePortal
                  value={dep}
                  onChange={(e, w) => {
                    setdep(w)
                   
                  }}
                  id="combo-box-demo"
                  options={["", ...auth?.departmentAll.filter((dd) => dd['faculty']?.includes(fac)).map(obj => obj['department'])]}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Department" />}
                />
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
  
                  onChange={(e, w) => {
                    console.log(dep, fac)
                    setlevel(w)
                  }
                  }
                  options={["", "100", "200", "300", "400", "500", "600"]}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Level" />}
                />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "50%" }}>
  
                  <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", width: "50%" }}>
                    <span onClick={() => preWeek(examWeeks.length)}>{"<<prev"}</span>
                    <h4 style={{}}>Week {0}</h4>
                    <span onClick={() => nextWeek(examWeeks.length)}>{"next>>"}</span>
                  </div>
                </div>
                {/* <Button onClick={()=>{}} variant="contained">{"Save"}</Button> */}
              </div>
              <div>No Time Table Generated</div>
            </>
  
          ) : (
            <div  ref={printableDivRef} style={{ display: "flex", flexDirection: "column" }}>
              {examWeeks?.map((week, weekIndex) => (
  
                
                      <>
                        <div key={weekINDEX} style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", }}>
  
                        <Button  title='Print' onClick={handlePrint1}>Print</Button>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "50%" }}>
  
                            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", width: "50%" }}>
                              <span onClick={() => preWeek(examWeeks.length)}>{"<<prev"}</span>
                              <h4 style={{}}>Week {weekIndex + 1}/{examWeeks.length}</h4>
                              <span onClick={() => nextWeek(examWeeks.length)}>{"next>>"}</span>
                            </div>
                          </div>
                          {/* <Button onClick={()=>{}} variant="contained">{"Save"}</Button> */}
                        </div>
                        <div style={{ width: "100%", display: "flex", background: '#f2f2f2', }}>
                          <div style={{ display: "flex", flexDirection: "column", }}>
                            {
                              examDays.map((day, dayIndex) => (
                                <div key={dayIndex} style={{ height: 170, display: "flex", alignItems: "center" }}>
  
                                  <div style={{ width: 150, background: '#f2f2f2', textAlign: "center" }}>
                                    {day}
                                  </div>
  
                                  <div style={{ display: "flex", flexDirection: "row" }}>
                                    {week
                                      .filter(exam => exam.day === day && exam.department.includes(auth.userData.depart) && exam.level.toString().includes(auth.userData.level))
                                      .map((exam, examIndex) => (
                                        <ExamCard key={examIndex} exam={exam} />
                                      ))}
                                  </div>
                                </div>
                              ))
                            }
  
                          </div>
  
  
  
                        </div>
                      </>
  
                  
  
  
  
              ))}
            </div>
          )}
            </>):(<>
              {!examWeeks || examWeeks.length === 0 ? (
            <>
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", }}>
  
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  value={fac}
                  onChange={(e, w) => {
                    setfac(w)
  
                  }
                  }
                  options={["", ...auth?.facultyAll?.map(obj => obj['name'])]}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Faculty" />}
                />
  
                <Autocomplete
                  disablePortal
                  value={dep}
                  onChange={(e, w) => {
                    setdep(w)
                   
                  }}
                  id="combo-box-demo"
                  options={["", ...auth?.departmentAll.filter((dd) => dd['faculty']?.includes(fac)).map(obj => obj['department'])]}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Department" />}
                />
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
  
                  onChange={(e, w) => {
                    console.log(dep, fac)
                    setlevel(w)
                  }
                  }
                  options={["", "100", "200", "300", "400", "500", "600"]}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Level" />}
                />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "50%" }}>
  
                  <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", width: "50%" }}>
                    <span onClick={() => preWeek(examWeeks.length)}>{"<<prev"}</span>
                    <h4 style={{}}>Week {0}</h4>
                    <span onClick={() => nextWeek(examWeeks.length)}>{"next>>"}</span>
                  </div>
                </div>
                {/* <Button onClick={()=>{}} variant="contained">{"Save"}</Button> */}
              </div>
              <div>No Time Table Generated</div>
            </>
  
          ) : (
            <div  ref={printableDivRef} style={{ display: "flex", flexDirection: "column" }}>
              {examWeeks?.map((week, weekIndex) => (
  
                <>
  
                  {
                    weekIndex === weekINDEX && (
                      <>
                        <div key={weekINDEX} style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", }}>
  
                        <Button  title='Print' onClick={handlePrint1}>Print</Button>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "50%" }}>
  
                            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", width: "50%" }}>
                              <span onClick={() => preWeek(examWeeks.length)}>{"<<prev"}</span>
                              <h4 style={{}}>Week {weekIndex + 1}/{examWeeks.length}</h4>
                              <span onClick={() => nextWeek(examWeeks.length)}>{"next>>"}</span>
                            </div>
                          </div>
                          {/* <Button onClick={()=>{}} variant="contained">{"Save"}</Button> */}
                        </div>
                        <div style={{ width: "100%", display: "flex", background: '#f2f2f2', }}>
                          <div style={{ display: "flex", flexDirection: "column", }}>
                            {
                              examDays.map((day, dayIndex) => (
                                <div key={dayIndex} style={{ height: 170, display: "flex", alignItems: "center" }}>
  
                                  <div style={{ width: 150, background: '#f2f2f2', textAlign: "center" }}>
                                    {day}
                                  </div>
  
                                  <div style={{ display: "flex", flexDirection: "row" }}>
                                    {week
                                      .filter(exam => exam.day === day && exam.department.includes(auth.userData.depart) && exam.level.toString().includes(auth.userData.level))
                                      .map((exam, examIndex) => (
                                        <ExamCard key={examIndex} exam={exam} />
                                      ))}
                                  </div>
                                </div>
                              ))
                            }
  
                          </div>
  
  
  
                        </div>
                      </>
  
                    )
                  }
                </>
  
  
  
              ))}
            </div>
          )}
            </>)
          }
  
        </DashboardLayout>
      </>
  
  
    );
  }

  

}

const ExamCard = ({ exam }) => {
  const cardStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '5px',
    margin: '5px',
    maxWidth: 150,
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const headingStyle = {
    fontSize: '1em',
    marginBottom: '5px',
  };

  const detailStyle = {
    marginBottom: '1px',
    fontSize: '12px',
  };
  const  convertTo12HourFormat=(timeRange)=> {
   
    
    
      const [startTime, endTime] = timeRange.split(' - ');
      const convertedStartTime = convertTo12Hour(startTime);
      const convertedEndTime = convertTo12Hour(endTime);
      return `${convertedStartTime} - ${convertedEndTime}`;
    
  
  
  }
  
  function convertTo12Hour(time) {
    // const [hours, minutes] = time.split(':');
    let period = 'AM';
  
    let convertedHours = parseInt(time, 10);
    if (convertedHours >= 12) {
      period = 'PM';
      if (convertedHours > 12) {
        convertedHours -= 12;
      }
    }
  
    return `${convertedHours.toString().padStart(2, '0')}:00 ${period}`;
  }
  
  
 

  return (
    <div style={cardStyle}>
      <h3 style={headingStyle}>{exam.course}</h3>

      <p style={detailStyle}>
        <strong>Time:</strong> {convertTo12HourFormat(exam.time)}
      </p>
      <p style={detailStyle}>
        <strong>Room:</strong> {exam.room?.venueCode}
      </p>
      <p style={detailStyle}>
        <strong>Invigilators:</strong> {exam?.lecturers?.map(lecturer => lecturer.lecturerName).join(', ')}
      </p>
    </div>
  );
};