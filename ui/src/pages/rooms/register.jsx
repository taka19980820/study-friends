import * as React from 'react';
import Layout from '@/components/Layout';
import MakeRoom from '@/components/Room/MakeRoom';

import { useRouter } from 'next/router';

const MakeRoomPage = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Layout redirectTo="/login">
      <MakeRoom roomId={id}/>
    </Layout>
  )
}

export default MakeRoomPage;