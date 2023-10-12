import * as React from 'react';
import Layout from '@/components/Layout';
import Room from '@/components/Room';
import { useRouter } from 'next/router';

const room = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Layout redirectTo="/login">
      <Room roomId={id}/>
    </Layout>
  )
}

export default room;