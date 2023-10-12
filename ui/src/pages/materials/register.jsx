import * as React from 'react';
import Layout from '@/components/Layout';
import AddMaterial from '@/components/Material/AddMaterial';

const addMaterial = () => {
  return (
    <Layout redirectTo="/login">
      <AddMaterial />
    </Layout>
  )
}

export default addMaterial;