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
import { SupplierListToolbar } from '../../components/supplier/supplier-list-toolbar';
import { SupplierListResults } from '../../components/supplier/supplier-list-results';  
import { DashboardLayout } from '../../components/dashboard-layout';
import SupplierProvider from '../../services/supplier-provider';

import {CONNECTION_ERROR} from '../../utils/constants'

class Supplier extends React.Component{
    
  constructor(props){
    super(props);

    this.state = {
      suppliers: [],
      nextPageUrl: '',
      loading: true,
      errorSBOpen: false,
      loadingOpen: true,
      errorSBText: ""
    };

  }

  componentDidMount(){
    this.setState({loadingOpen:true,...this.state})
    SupplierProvider.getSuppliers().then(
      (response) => {
        console.log(response.data)
        this.setState({loadingOpen:false, suppliers : response.data, loading: false})
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
              FOURNISSEUR| Material Kit
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
              <SupplierListToolbar />
              <SupplierListResults supplierList={this.state.suppliers} />
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

Supplier.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Supplier;
