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
import { PRListToolbar } from '../../components/purchase-request/pr-list-toolbar';
import { PRListResults } from '../../components/purchase-request/pr-list-results';  
import { DashboardLayout } from '../../components/dashboard-layout';
import PurchaseRequestProvider from '../../services/purchase-request-provider';

import {CONNECTION_ERROR} from '../../utils/constants'

class PurchaseRequest extends React.Component{
    
  constructor(props){
    super(props);

    this.state = {
      purchaseRequests: [],
      nextPageUrl: '',
      loading: true,
      errorSBOpen: false,
      loadingOpen: true,
      errorSBText: ""
    };

  }

  componentDidMount(){
    this.setState({loadingOpen:true,...this.state})
    PurchaseRequestProvider.getPurchaseRequests().then(
      (response) => {
        console.log(response.data)
        this.setState({loadingOpen:false, purchaseRequests : response.data, loading: false})
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
              DEMANDE D'ACHAT | Material Kit
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
              <PRListToolbar />
              <PRListResults purchaseReqList={this.state.purchaseRequests} />
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

PurchaseRequest.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default PurchaseRequest;
