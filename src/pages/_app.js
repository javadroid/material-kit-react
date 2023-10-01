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
import { useEffect } from 'react';
import { getData } from 'src/service/Api';
import { useAuth } from 'src/hooks/useAuth';

const clientSideEmotionCache = createEmotionCache();

const SplashScreen = () => null;

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  useNProgress();
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
      if (!sud && !auth1.userData) {
        window.location.href = window.location.host + "/auth/login"
      }
    }
    getall()
  }, [])

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>
          Generic
        </title>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthConsumer>
              {
                (auth) => auth.isLoading
                  ? <SplashScreen />
                  : getLayout(<Component {...pageProps} />)
              }
            </AuthConsumer>
          </ThemeProvider>
        </AuthProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
};

export default App;
