import Head from 'next/head';
import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Pagination,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';

import { StoreListToolbar } from '../../components/store/store-list-toolbar';
import { StoreListResults } from '../../components/store/store-list-results';

import { DashboardLayout } from '../../components/dashboard-layout';

import StoreProvider from '../../services/store-provider';

import {CONNECTION_ERROR} from '../../utils/constants'

class Store extends React.Component{
    
  constructor(props){
    super(props);

    this.state = {
      stores: [],
      nextPageUrl: '',
      loading: true,
      errorSBOpen: false,
      loadingOpen: true,
      errorSBText: ""
    };

  }

  componentDidMount(){
    this.setState({loadingOpen:true,...this.state})
    StoreProvider.getStores().then(
      (response) => {
        console.log(response.data)
        this.setState({loadingOpen:false, stores : response.data, loading: false})
      },
      error => {
        this.setState({loadingOpen:false})
        this.handleSBOpen(CONNECTION_ERROR)
      }
    )
  }

  handleSBClose(){
    this.setState({errorSBOpen:false})
  }

  handleSBOpen(text){
    this.setState({errorSBOpen:true, errorSBText:text})

  }

  render() {
    return( 
      <>
      {this.state.loading === true &&
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
              Magasin| Material Kit
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
              <StoreListToolbar />
              <StoreListResults storeList={this.state.stores} />
            </Container>
            
          </Box>
          
        </>}
        <Snackbar open={this.state.errorSBOpen} 
          onClose={()=>this.handleSBClose()}>
            <Alert variant="filled" 
            severity="error">
              {this.state.errorSBText}
            </Alert>
          </Snackbar>
      </>
      );
  }
  
}

Store.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Store;
