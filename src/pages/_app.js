import Head from 'next/head';
import { CacheProvider } from '@emotion/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { AuthConsumer, AuthProvider } from 'src/contexts/auth-context';
import { useNProgress } from 'src/hooks/use-nprogress';
import { createTheme } from 'src/theme';
import { createEmotionCache } from 'src/utils/create-emotion-cache';
import 'simplebar-react/dist/simplebar.min.css';
import { useEffect, useState } from 'react';
import { getData } from 'src/service/Api';
import { useAuth } from 'src/hooks/useAuth';
import { useRouter } from 'next/navigation';
const clientSideEmotionCache = createEmotionCache();

const SplashScreen = () => null;

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
const router = useRouter();
  useNProgress();
  const [load,setload]= useState(false)
  const auth1 = useAuth()
  const getLayout = Component.getLayout ?? ((page) => page);

  const theme = createTheme();
  useEffect(() => {
    
    getData("faculty", auth1?.setfaculty)
    getData("department", auth1?.setdepartment)
    getData("course", auth1?.setcourse)
    getData("venue", auth1?.setvenue)
    
    const getall = async () => {
      const sud = JSON.parse(await localStorage.getItem("userData"))

      // console.log(first)
      if (!sud && !auth1.userData) {
        router.push('/auth/login');
        setload(true)
      }else{
        if(sud.userData?.type===("Admin")){
          router.push('/ViewETG');
          setload(true)
        }else{
          setload(true)
        }
        
      }


    }
    getall()

    
  }, [])

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>
          Genetic
        </title>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* <AuthConsumer>
             
            </AuthConsumer> */}
             {
                  !load
                  ? <SplashScreen />
                  : getLayout(<Component {...pageProps} />)
              }
          </ThemeProvider>
        </>
      </LocalizationProvider>
    </CacheProvider>
  );
};

export default App;
