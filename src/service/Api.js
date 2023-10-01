
import bcrypt from 'bcryptjs';
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC1ajPKpaYtc-0DmsS7pVAETysBlcfp1hI",
  authDomain: "nukloeids.firebaseapp.com",
  databaseURL: "https://nukloeids-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "nukloeids",
  storageBucket: "nukloeids.appspot.com",
  messagingSenderId: "814959231679",
  appId: "1:814959231679:web:438bf3da031c575dab3c0a"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export const signup = async (matric, password, depart, level, fullname, type, router, helpers, auth) => {
  const iduui = Math.floor(Math.random() * 10000) + 148 + Date.now()
  const q = query(collection(db, "users"), where("matric", "==", matric));

  const querySnapshot = await getDocs(q);
 console.log(querySnapshot)
 if(querySnapshot.docChanges().length===0){
  bcrypt.hash(password, 10, async (err, hash) => {
    
    if (err) {
      console.log({
        id: iduui, matric, password: hash, depart, level, fullname, type
      })
      return ({
        err
      });
    } else {
      const e_code = Math.floor(Math.random() * 10000) + 148;

      await setDoc(doc(db, 'users/' + iduui), {
        id: iduui, matric, password: hash, depart, level, fullname, type
      });

      auth.setAuth({
        id: iduui, matric, password: hash, depart, level, fullname, type
      })
      router.push('/');

    }
  });
}
  querySnapshot.forEach((docfound) => {
    console.log({
      id: iduui, matric, password:  depart, level, fullname, type
    })
    if (docfound.exists()) {
      helpers.setStatus({ success: false });
      helpers.setErrors({ submit: "users already exist" });
      helpers.setSubmitting(false);
      return { msgerr: "Username or password is incorrect!" }
    } else {
       bcrypt.hash(password, 10, async (err, hash) => {
        console.log({
          id: iduui, matric, password: hash, depart, level, fullname, type
        })
        if (err) {
          console.log({
            id: iduui, matric, password: hash, depart, level, fullname, type
          })
          return ({
            err
          });
        } else {
          const e_code = Math.floor(Math.random() * 10000) + 148;

          await setDoc(doc(db, 'users/' + iduui), {
            id: iduui, matric, password: hash, depart, level, fullname, type
          });

          auth.setAuth({
            id: iduui, matric, password: hash, depart, level, fullname, type
          })
          router.push('/');

        }
      });
    }

  });

};

export const login = async (matric, password, router, helpers, auth) => {
  const q = query(collection(db, "users"), where("matric", "==", matric));

  const querySnapshot = await getDocs(q);

  if(querySnapshot.docChanges().length===0){
    helpers.setStatus({ success: false });
    helpers.setErrors({ submit: 'Username or password is incorrect!' });
    helpers.setSubmitting(false);
  }

  querySnapshot.forEach((docfound) => {

    if (!docfound.exists()) {
      console.log("first")
      helpers.setStatus({ success: false });
      helpers.setErrors({ submit: 'Username or password is incorrect!' });
      helpers.setSubmitting(false);
      
    } else {

      const { password: hash } = docfound.data()
      const { id } = docfound.data()

      bcrypt.compare(
        password,
        hash,
        (bErr, bResult) => {
          if (bErr) {
            helpers.setStatus({ success: false });
            helpers.setErrors({ submit: 'Username or password is incorrect!' });
            helpers.setSubmitting(false);
            return ({
              msgerr: 'Username or password is incorrect!'
            });
          }
          if (bResult) {

            console.log({
              msg: 'Logged in!',

              user: docfound.data()
            })
            auth.setAuth(docfound.data())
            window.location.href=window.location.host
            router.push('/');
          } else {
            helpers.setStatus({ success: false });
            helpers.setErrors({ submit: 'Username or password is incorrect!' });
            helpers.setSubmitting(false);
            return { msgerr: "Username or password is incorrect!" }
          }

        }
      );
    }
  })

}

export const getData = async (name,auth) =>{
  const querySnapshot = await getDocs(collection(db,name));
  const dataAll=[]
querySnapshot.forEach((doc) => {
  dataAll.push(doc.data())
});
auth(dataAll)
return dataAll
}

export const updateData = async(name,data,  handleCloseModal,setReload)=>{
 
// Set the "capital" field of the city 'DC'
console.log({name,data})
await updateDoc(doc(db,name+'/' + data.id), 
  data
);
const iduui = Math.floor(Math.random() * 10000) + 148 + Date.now()
setReload(iduui)
handleCloseModal()
}

export const addData = async(name,data,  handleCloseModal,setReload)=>{
  const iduui = Math.floor(Math.random() * 10000) + 148 + Date.now()
  await setDoc(doc(db, name+'/' + iduui), {...data,id:iduui});
  handleCloseModal()
  setReload(iduui)
}

export const deletData = async(name,id,handleCloseModal,setReload)=>{
  const iduui = Math.floor(Math.random() * 10000) + 148 + Date.now()
  await deleteDoc(doc(db, name+'/' + id));
  handleCloseModal()
  setReload(iduui)
}