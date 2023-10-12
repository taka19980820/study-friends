import * as React from 'react';
import Layout from '@/components/Layout';
import Rooms from '@/components/Room/Rooms';

const RoomsPage = () => {
  return (
    <Layout redirectTo="/login">
      <Rooms />
    </Layout>
  )
}

export default RoomsPage;
