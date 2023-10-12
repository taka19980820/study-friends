import * as React from 'react';
import Layout from '@/components/Layout';
import Logs from '@/components/Log';


const Index = () => {
  return (
    <Layout redirectTo="/login">
      <Logs />
    </Layout>
  )
}

export default Index;
