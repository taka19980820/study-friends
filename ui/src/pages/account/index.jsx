import * as React from 'react';
import Layout from '@/components/Layout';
import Account from '@/components/Account';


const account = () => {
  return (
    <Layout redirectTo="/login">
      <Account />
    </Layout>
  )
}

export default account;