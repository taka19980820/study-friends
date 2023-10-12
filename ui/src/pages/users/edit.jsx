import * as React from 'react';
import Layout from '@/components/Layout';
import EditUser from '@/components/User/EditUser';

const editUser = () => {
  return (
    <Layout redirectTo="/login">
      <EditUser />
    </Layout>
  )
}

export default editUser;