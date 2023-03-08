// import { useState, useEffect } from 'react';
// import { Auth, Hub } from 'aws-amplify';
import './App.css';
import { ProvideAuth } from './hooks/use-auth';
// import { Amplify } from 'aws-amplify';
// import { Authenticator } from 'aws-amplify-react';
// import '@aws-amplify/ui-react/styles.css';
import Router from './Router';

// Amplify.configure({
//   Auth: {
//     identityPoolId: "ap-northeast-1:97219dbd-79e9-42d0-99b9-709026047011",
//     region: "ap-northeast-1",
//     userPoolId: "ap-northeast-1_aYtobNFuG",
//     userPoolWebClientId: "677uhm8rb3oarqu72ar83fjcln"
//   }
// });

// const federatedConfig = {
//   google_client_id: "1064095739665-khsu8takel5ph7rk15qam229mmca6afr.apps.googleusercontent.com"
// }

function App() {

  return (
    <ProvideAuth>
      <Router />
    </ProvideAuth>
  );
};

  // <Authenticator hideSignUp={true} federated={federatedConfig}>
  //   <Router />
  // </Authenticator>

export default App;
