import * as React from 'react';
import Layout from '@/components/Layout';
import Record from '@/components/Record';
import { useRouter } from 'next/router';

const UserRecordPage = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <Layout redirectTo="/login">
      <Record userId={id} />
    </Layout>
  )
}

export default UserRecordPage;