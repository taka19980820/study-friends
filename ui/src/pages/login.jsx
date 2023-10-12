import * as React from 'react';
import Login from '../components/User/Login';
import Layout from '@/components/Layout';
import NoLoginLayout from '@/components/Layout/NoLoginLayout';

const LoginPage = () => {
  return (
    <NoLoginLayout redirectTo={null}>
      <Login />
    </NoLoginLayout>
  )
}

export default LoginPage;