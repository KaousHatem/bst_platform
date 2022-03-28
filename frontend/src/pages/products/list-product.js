import Head from 'next/head';
import React from 'react';
import { Box, Container } from '@mui/material';
import { ProductListResults } from '../../components/product/product-list-results';
import { CustomerListToolbar } from '../../components/product/customer-list-toolbar';
import { DashboardLayout } from '../../components/dashboard-layout';
import { customers } from '../../__mocks__/customers';

import ProductProvider from '../../services/product-provider'
import CategoryProvider from '../../services/category-provider'



class Products extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      products: [],
      categories: [],
      loading: true
    };

  

  }

  componentDidMount(){
    Promise.all([
      ProductProvider.getProducts(),
      CategoryProvider.getCategories()
      ]).then((responses) => {
        console.log(responses)
        this.setState({products : responses[0].data,categories : responses[1].data, loading: false})
      })
    // ProductProvider.getProducts().then(
    //   (response) => {
    //     this.setState({products : response.data, productsLoading: false,  ...this.state})
    //     console.log(this.state)
    //   }
    // )

    // CategoryProvider.getCategories().then(
    //   (response) => {
    //      this.setState({categories : response.data, categoriesLoading:false,  ...this.state})
    //   }
    //   )
  }
 
  render() {
    return(this.state.loading == false &&
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
  )
  }
    
}

  
  
  

  



Products.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Products;
