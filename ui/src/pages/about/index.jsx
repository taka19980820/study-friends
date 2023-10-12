import * as React from 'react';
import { useContext } from 'react';
import { AuthContext } from '@/context/Auth/AuthContext';
import About from '../../components/About';
import Layout from '@/components/Layout';
import NoLoginLayout from '@/components/Layout/NoLoginLayout';

export default function AboutPage() {
  const { authUser } = useContext(AuthContext);

  if(authUser) {
    return (
        <Layout redirectTo="/login">
          <About />
        </Layout>
    )
  } else {
    return (
      <NoLoginLayout redirectTo={null}>
        <About />
      </NoLoginLayout>
    )
  }

}
