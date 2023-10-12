import * as React from 'react';
import Layout from '@/components/Layout';
import AddMaterial from '@/components/Material/AddMaterial';

const AddMaterialPage = () => {
  return (
    <Layout redirectTo="/login">
      <AddMaterial />
    </Layout>
  )
}

export default AddMaterialPage;