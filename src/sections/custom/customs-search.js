import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Autocomplete, Card, InputAdornment, OutlinedInput, SvgIcon, TextField } from '@mui/material';
import { useState } from 'react';

export const CustomsSearch = ({name,data,setData,keys,main,auth}) => {
const [dep,setdep]=useState()
const [fac,setfac]=useState()

  return (
    <Card style={{display:'flex',flexDirection:"row",justifyContent:"space-between"}} sx={{ p: 2 , }}>
    <OutlinedInput
      defaultValue=""
      fullWidth
      onInput={(e)=>setData(main.filter((user)=>user[keys].includes(e.target.value)))}
      
      // onChangeCapture={}
      placeholder={name}
      startAdornment={(
        <InputAdornment position="start">
          
          <SvgIcon
            color="action"
            fontSize="small"
          >
            <MagnifyingGlassIcon />
          </SvgIcon>
        </InputAdornment>
      )}
      sx={{ maxWidth: 500 }}
    />

{
  keys==="department"&&(
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      value={fac}
      onChange={(e,w)=>{
        setfac(w)
          setData(main.filter((dd)=>dd['faculty']?.includes(w))) 
        
      }
      }
      options={["",...auth?.facultyAll?.map(obj => obj['name'])]}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Faculty" />}
    />
  )
}
    {keys==="code"&&(
     <>
      <Autocomplete
      disablePortal
      id="combo-box-demo"
      value={fac}
      onChange={(e,w)=>{
        setfac(w)
          setData(main.filter((dd)=>dd['faculty']?.includes(w))) 
        
      }
      }
      options={["",...auth?.facultyAll?.map(obj => obj['name'])]}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Faculty" />}
    />
      <Autocomplete
      disablePortal
      value={dep}
      onChange={(e,w)=>{
        setdep(w)
        setData(main.filter((dd)=>dd['faculty'].includes(fac)&&dd['department'].includes(w)))}}
      id="combo-box-demo"
      options={["",...auth?.departmentAll.map(obj => obj['department']).filter((dd)=>dd['faculty']?.includes(fac))]}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Department" />}
    />
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      
      onChange={(e,w)=>{
        if(dep!==""){
          setData(main.filter((dd)=>dd['faculty'].includes(fac)&&dd['department'].includes(dep)&&dd['level'].includes(w)))
        }else{
          setData(main.filter((dd)=>dd['level'].includes(w))) 
        }
      }
      }
      options={["", "100", "200", "300", "400", "500", "600"]}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Level" />}
    />
     </>
    )}
  </Card>
  )
}
