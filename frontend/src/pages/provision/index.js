import Head from 'next/head';
import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Pagination ,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { ProvisionListToolbar } from '../../components/provision/provision-list-toolbar';
import { ProvisionListResults } from '../../components/provision/provision-list-results';  
import { DashboardLayout } from '../../components/dashboard-layout';
import { provisions } from '../../__mocks__/provisions';

import ProvisionsProvider from '../../services/provision-provider'

import {CONNECTION_ERROR} from '../../utils/constants'

class Provisions extends React.Component{

    
  constructor(props){
    super(props);

    this.state = {
      provisions: [],
      nextPageUrl: '',
      loading: true,
      errorSBOpen: false,
      loadingOpen: true,
      errorSBText: ""

    };

  }

  componentDidMount(){
    this.setState({loadingOpen:true,...this.state})
    ProvisionsProvider.getProvisions().then(
      (response) => {
        this.setState({loadingOpen:false, provisions : response.data, loading: false})
      },
      error => {
        this.setState({loadingOpen:false})
        this.handleSBOpen(CONNECTION_ERROR)
      }
    )
  }

  handleSBClose(){
    this.setState({errorSBOpen:false})
    setErrorSBOpen(false)
  }

  handleSBOpen(text){
    this.setState({errorSBOpen:true, errorSBText:text})

  }


  render() {
    return( 
      <> {this.state.loading == true &&
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={this.state.loadingOpen}
          onClick={()=>{setLoadingOpen(false)}}
        >
          <CircularProgress color="inherit" />
        </Backdrop> ||
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
              <Box sx={{ mt: 3 }}>
                <ProvisionListResults provision_list={this.state.provisions} />
              </Box>
            </Container>
            
          </Box>
          <Snackbar open={this.state.errorSBOpen} 
          onClose={this.handleSBClose}>
            <Alert variant="filled" 
            severity="error">
              {this.state.errorSBText}
            </Alert>
          </Snackbar>
        </>}
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
