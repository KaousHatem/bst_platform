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
      loading: true,
      errorSBOpen: false,
      loadingOpen: true,
      errorSBText: ""
    };

  }

  componentDidMount(){
    this.setState({loadingOpen:true,...this.state})
    CategoryProvider.getCategories().then(
      (response) => {
        console.log(response.data)
        this.setState({loadingOpen:false, categories : response.data, loading: false})
      },error => {
        his.setState({loadingOpen:false})
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
      <> { this.state.loading === true &&
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

Categories.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Categories;
