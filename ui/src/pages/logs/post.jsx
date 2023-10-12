import * as React from 'react';
import Layout from '@/components/Layout';
import PostLog from '@/components/Log/PostLog';

const post = () => {
  return (
    <Layout redirectTo="/login">
      <PostLog />
    </Layout>
  )
}

export default post;