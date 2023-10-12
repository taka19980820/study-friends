import * as React from 'react';
import Login from '../components/User/Login';
import Layout from '@/components/Layout';
import NoLoginLayout from '@/components/Layout/NoLoginLayout';

export default function login() {
  return (
    <NoLoginLayout redirectTo={null}>
      <Login />
    </NoLoginLayout>
  )
}
