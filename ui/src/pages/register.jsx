import * as React from 'react';
import Register from '../components/User/Register';
import NoLoginLayout from '@/components/Layout/NoLoginLayout';

export default function register() {
  return (
    <NoLoginLayout redirectTo={null}>
      <Register />
    </NoLoginLayout>
  )
}
