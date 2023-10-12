import * as React from 'react';
import Register from '../components/User/Register';
import NoLoginLayout from '@/components/Layout/NoLoginLayout';

const RegisterPage = () => {
  return (
    <NoLoginLayout redirectTo={null}>
      <Register />
    </NoLoginLayout>
  )
}

export default RegisterPage;