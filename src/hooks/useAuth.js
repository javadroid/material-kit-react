import { useCallback, useEffect, useState } from 'react';

export const useAuth = () => {
  const [userData, setUserData] = useState();
  const [userAll, setUserAll] = useState([]);
  const [facultyAll, setFacultyAll] = useState([]);
  const [departmentAll, setDepartmentAll] = useState([]);
  const [courseAll, setcourseAll] = useState([]);
  const [venueAll, setvenueAll] = useState([]);

  useEffect(() => {
    const getall=async()=>{
      const sud=JSON.parse(await localStorage.getItem("userData"))
      const sua=JSON.parse(await localStorage.getItem("userAll"))
      const sfa=JSON.parse(await localStorage.getItem("facultyAll"))
      const sca=JSON.parse(await localStorage.getItem("courseAll"))
      const sda=JSON.parse(await localStorage.getItem("departmentAll"))
      const sva=JSON.parse(await localStorage.getItem("venueAll"))

      if(sud||sua||sfa||sda||sca||sva){
        console.log({sca,sda})
    setUserData(sud);
    setUserAll(sua);
    setFacultyAll(sfa)
    setDepartmentAll(sda)
    setcourseAll(sca)
    setvenueAll(sva)
      }


    }
    getall()
  }, []);
  
  const clearAuth = useCallback(() => {
    setUserData();
    localStorage.clear()
  }, []);

  const setAuth = useCallback((user) => {
    setUserData({...user});
    localStorage.setItem("userData",JSON.stringify({...user}))
    console.log(user)
  }, []);

  const setUsers = useCallback((data) => {
    setUserAll(data);
    localStorage.setItem("userAll",JSON.stringify(data))
  }, []);
  const setfaculty = useCallback((data) => {
    setFacultyAll(data);
    localStorage.setItem("facultyAll",JSON.stringify(data))
  }, []);
  const setdepartment = useCallback((data) => {
    setDepartmentAll(data);
    localStorage.setItem("departmentAll",JSON.stringify(data))
  }, []);

  const setcourse = useCallback((data) => {
    setcourseAll(data);
    localStorage.setItem("courseAll",JSON.stringify(data))
  }, []);
  const setvenue = useCallback((data) => {
    setvenueAll(data);
    localStorage.setItem("venueAll",JSON.stringify(data))
  }, []);
  return {
    clearAuth,
    userData,
    setAuth,
    setUsers,
    userAll,
    setfaculty,
    setcourse,
    setdepartment,
    departmentAll,
    facultyAll,
    courseAll,
    setvenue,
    venueAll
  };
};
