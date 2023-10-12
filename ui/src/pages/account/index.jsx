import * as React from 'react';
import Layout from '@/components/Layout';
import Account from '@/components/Account';


const AccountPage = () => {
  return (
    <Layout redirectTo="/login">
      <Account />
    </Layout>
  )
}

export default AccountPage;