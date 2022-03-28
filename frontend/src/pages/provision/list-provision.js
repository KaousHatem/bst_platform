import Head from 'next/head';
import React from 'react';
import { Box, Container, Grid, Pagination } from '@mui/material';
import { ProvisionListToolbar } from '../../components/provision/provision-list-toolbar';
import { ProvisionListResults } from '../../components/provision/provision-list-results';  
import { DashboardLayout } from '../../components/dashboard-layout';
import { provisions } from '../../__mocks__/provisions';

import ProvisionsProvider from '../../services/provision-provider'

class Provisions extends React.Component{
    
  constructor(props){
    super(props);

    this.state = {
      provisions: [],
      nextPageUrl: '',
      loading: true
    };

  }

  componentDidMount(){
    ProvisionsProvider.getProvisions().then(
      (response) => {
        this.setState({provisions : response.data, loading: false})
      }
    )
  }

  render() {
    return( this.state.loading == false &&
      <>
        <Head>
          <title>
            Provisions | Material Kit
          </title>
        </Head>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8
          }}
        >
          <Container maxWidth = {false}>
            <ProvisionListToolbar />
            {this.state.provisions.length!==0 && <Box sx={{ mt: 3 }}>
              <ProvisionListResults provision_list={this.state.provisions} />
            </Box>}
          </Container>
          
        </Box>
      </>
      );
  }
  
}

Provisions.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Provisions;
