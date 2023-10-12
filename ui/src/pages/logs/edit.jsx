import * as React from 'react';
import Layout from '@/components/Layout';
import EditLog from '@/components/Log/EditLog';
import { useRouter } from 'next/router';

const EditLogPage = () => {
  const router = useRouter();
  const { logId } = router.query;
  return (
    <Layout redirectTo="/login">
      <EditLog logId={logId} />
    </Layout>
  )
}

export default EditLogPage;