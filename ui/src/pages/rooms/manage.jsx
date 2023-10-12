import * as React from 'react';
import Layout from '@/components/Layout';
import ManageRoom from '@/components/Room/ManageRoom';
import { useRouter } from 'next/router';

const manage = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Layout redirectTo="/login">
      <ManageRoom roomId={id}/>
    </Layout>
  )
}

export default manage;