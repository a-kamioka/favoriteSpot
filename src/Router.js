import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/use-auth';
import { Auth } from 'aws-amplify';
// import { SignIn } from './auth/SignIn';
import Header from './components/Header';
import View from './components/View';
import List from './components/List';

const Router = () => {
  const { isLoading, isAuthenticated } = useAuth();
  if (isLoading) {
    return <></>
  }

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/view" />} />
        <Route path="/view" element={isAuthenticated ? <View /> : Auth.federatedSignIn()} />
        <Route path="/list" element={isAuthenticated ? <List /> : Auth.federatedSignIn()} />
        <Route path="*" element={<p>Page Not Found</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;