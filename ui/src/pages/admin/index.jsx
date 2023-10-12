import * as React from 'react';
import Layout from '@/components/Layout';
import Admin from '@/components/Admin';


const AdminPage = () => {
  return (
    <Layout redirectTo="/login">
      <Admin />
    </Layout>
  )
}

export default AdminPage;