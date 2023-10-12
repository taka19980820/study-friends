import * as React from 'react';
import Layout from '@/components/Layout';
import User from '@/components/User';
import { useRouter } from 'next/router';

const UserPage = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Layout redirectTo="/login">
      <User userId={id} />
    </Layout>
  )
}

export default UserPage;
