import * as React from 'react';
import Layout from '@/components/Layout';
import Rooms from '@/components/Room/Rooms';

const rooms = () => {
  return (
    <Layout redirectTo="/login">
      <Rooms />
    </Layout>
  )
}

export default rooms;
