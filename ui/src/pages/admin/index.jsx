import * as React from 'react';
import Layout from '@/components/Layout';
import Admin from '@/components/Admin';


const admin = () => {
  return (
    <Layout redirectTo="/login">
      <Admin />
    </Layout>
  )
}

export default admin;