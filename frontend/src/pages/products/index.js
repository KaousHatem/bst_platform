import Head from 'next/head';
import React from 'react';
import { 
  Box, 
  Container,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { ProductListResults } from '../../components/product/product-list-results';
import { CustomerListToolbar } from '../../components/product/customer-list-toolbar';
import { DashboardLayout } from '../../components/dashboard-layout';
import { customers } from '../../__mocks__/customers';

import ProductProvider from '../../services/product-provider'
import CategoryProvider from '../../services/category-provider'

import {CONNECTION_ERROR} from '../../utils/constants'

class Products extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      products: [],
      categories: [],
      loading: true,
      errorSBOpen: false,
      loadingOpen: true,
      errorSBText: ""
    };

  

  }

  componentDidMount(){
    this.setState({loadingOpen:true,...this.state})
    Promise.all([
      ProductProvider.getProducts(),
      CategoryProvider.getCategories()
      ]).then((responses) => {
        console.log('log')
        this.setState({loadingOpen:false, products : responses[0].data,categories : responses[1].data, loading: false})
      },
      (errors)=>{
        console.log('lof')
        this.setState({loadingOpen:false})
        this.handleSBOpen(CONNECTION_ERROR)
      })
    
  }

  handleSBClose(){

    this.setState({errorSBOpen:false,...this.state})
  }

  handleSBOpen(text){
    this.setState({errorSBOpen:true, errorSBText:text})

  }
 
  render() {
    return(<>{this.state.loading === true &&
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
          EURL BST | Approvisionnement
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth={false}>
          <CustomerListToolbar />
          <Box sx={{ mt: 3 }}>
            <ProductListResults product={this.state.products} 
            categories={this.state.categories} />
          </Box>
        </Container>
      </Box>
    </>
  }
  <Snackbar open={this.state.errorSBOpen} 
    onClose={()=>this.handleSBClose()}>
      <Alert variant="filled" 
      severity="error">
        {this.state.errorSBText}
      </Alert>
    </Snackbar>
  </>
  )
  }
    
}

  
  
  

  



Products.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Products;
