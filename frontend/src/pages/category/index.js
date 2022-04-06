import Head from 'next/head';
import React from 'react';
import { Box, Container, Grid, Pagination } from '@mui/material';
import { CategoryListToolbar } from '../../components/category/category-list-toolbar';
import { CategoryListResults } from '../../components/category/category-list-results';  
import { DashboardLayout } from '../../components/dashboard-layout';
import CategoryProvider from '../../services/category-provider';

class Categories extends React.Component{
    
  constructor(props){
    super(props);

    this.state = {
      categories: [],
      nextPageUrl: '',
      loading: true
    };

  }

  componentDidMount(){
    CategoryProvider.getCategories().then(
      (response) => {
        console.log(response.data)
        this.setState({categories : response.data, loading: false})
      }
    )
  }

  render() {
    return( this.state.loading == false &&
      <>
        <Head>
          <title>
            Categories | Material Kit
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
            <CategoryListToolbar />
            <CategoryListResults category_list={this.state.categories} />
          </Container>
          
        </Box>
      </>
      );
  }
  
}

Categories.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Categories;
