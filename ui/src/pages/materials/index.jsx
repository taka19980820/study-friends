import * as React from 'react';
import Layout from '@/components/Layout';
import Materials from '@/components/Material/Materials';

const materials = () => {
  return (
    <Layout redirectTo="/login">
      <Materials />
    </Layout>
  )
}

export default materials;
