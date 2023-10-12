import * as React from 'react';
import Layout from '@/components/Layout';
import EditMaterial from '@/components/Material/Edit';
import { useRouter } from 'next/router';

const EditMaterialPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout redirectTo="/login">
      <EditMaterial materialId={id} />
    </Layout>
  )
}

export default EditMaterialPage;