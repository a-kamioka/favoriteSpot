import { Amplify, Auth, Hub } from 'aws-amplify'
import { createContext, useContext, useEffect, useState } from 'react';

Amplify.configure({
  Auth: {
    region: process.env.EACT_APP_AUTH_REGION,
    userPoolId: process.env.REACT_APP_AUTH_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_AUTH_USER_POOL_WEB_CLIENT_ID,
    oauth: {
      domain: 'auth.kinakolab.com',
      scope: ['openid', 'aws.cognito.signin.user.admin'],
      redirectSignIn: 'https://favoritespot.kinakolab.com',
      redirectSignOut: 'https://favoritespot.kinakolab.com',
      responseType: 'code'
    }
  }
});

const authContext = createContext();

export const ProvideAuth = ({children}) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const useAuth = () => {
  return useContext(authContext);
};

const useProvideAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [owner, setOwner] = useState('');
  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      const userData = await Auth.currentAuthenticatedUser();
      // Auth.currentSession().then((data) => {
      //   console.log(`token: ${data.getIdToken().getJwtToken()}`);
      // });
      // console.log(userData);
      return userData;
    } catch (e) {
      return console.log('Not Signed in');
    }
  };

  const listener = ({ payload: {event, data} }) => {
    switch (event) {
      case 'signIn':
      case 'cognitoHostedUI':
        void getUser().then((userData) => setUser(userData));
        break;
      case 'signOut':
        setUser(null);
        break;
      case 'signIn_failure':
      case 'cognitoHostedUI_failure':
      default:
        console.log('Sign in failure', data);
        break;
    }
  };

  useEffect(() => {
    Hub.listen('auth', listener);
    void getUser()
      .then((result) => {
        setUsername(result.username);
        setOwner(result.username);
        setIsAuthenticated(true);
        setIsLoading(false);
        setAccessToken(result.signInUserSession.idToken.jwtToken);
        if (result.signInUserSession.idToken.payload.name) {
          setUsername(result.signInUserSession.idToken.payload.name)
        }
      })
      .catch(() => {
        setUsername('');
        setIsAuthenticated(false);
        setIsLoading(false);
      });
  }, []);


  const signUp = async (username, password, email) => {
    try {
      await Auth.signUp({ username, password, attributes: { email } });
      setUsername(username);
      setPassword(password);
      return { success: true, message: '' };
    } catch (error) {
      return {
        success: false,
        message: 'アカウントの作成に失敗しました。',
      };
    }
  };

  const confirmSignUp = async (verificationCode) => {
    try {
      await Auth.confirmSignUp(username, verificationCode);
      const result = await signIn(username, password);
      setPassword('');
      return result;
    } catch (error) {
      return {
        success: false,
        message: '確認コードの認証に失敗しました。',
      };
    }
  };

  const signIn = async (username, password) => {
    try {
      const result = await Auth.signIn(username, password);
      setUsername(result.username);
      setIsAuthenticated(true);
      setAccessToken(result.signInUserSession.idToken.jwtToken);
      return { success: true, message: '' };
    } catch (error) {
      return {
        success: false,
        message: 'ログインに失敗しました。',
      };
    }
  };

  const signOut = async () => {
    try {
      await Auth.signOut();
      setUsername('');
      setIsAuthenticated(false);
      return {
        success: true,
        message: 'ログアウトしました。',
      };
    } catch (error) {
      return {
        success: false,
        message: 'ログアウトに失敗しました。',
      };
    }
  };

  return {
    isLoading,
    isAuthenticated,
    username,
    accessToken,
    owner,
    signUp,
    confirmSignUp,
    signIn,
    signOut
  };
};