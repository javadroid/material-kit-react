import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useAuth } from 'src/hooks/useAuth';
import { getData } from 'src/service/Api';

export const AuthGuard = (props) => {
  const { children } = props;
  const router = useRouter();
  const auth = useAuth();
  const ignore = useRef(false);
  const [checked, setChecked] = useState(false);

  // Only do authentication check on component mount.
  // This flow allows you to manually redirect the user after sign-out, otherwise this will be
  // triggered and will automatically redirect to sign-in page.

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }
      getData("faculty", auth?.setfaculty)
      getData("department", auth?.setdepartment)
      getData("course", auth?.setcourse)
      // Prevent from calling twice in development mode with React.StrictMode enabled
      if (ignore.current) {
        return;
      }
console.log({first:auth.userData})
      ignore.current = true;

      setTimeout(()=>{
        if (!auth.userData) {
          console.log('Not authenticated, redirecting');
          setChecked(true);
          // router
          //   .replace({
          //     pathname: '/auth/login',
          //     query: router.asPath !== '/' ? { continueUrl: router.asPath } : undefined
          //   })
          //   .catch(console.error);
        } else {
          
          setChecked(true);
        }
      },500)
     
    },
    [router.isReady,auth.userData]
  );

  if (!checked) {
    return null;
  }

  // If got here, it means that the redirect did not occur, and that tells us that the user is
  // authenticated / authorized.

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node
};
