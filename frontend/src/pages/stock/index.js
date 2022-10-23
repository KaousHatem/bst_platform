import Head from 'next/head';
import React from 'react';
import { withRouter } from 'next/router'
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

import { StockListToolbar } from '../../components/stock/stock-list-toolbar';
import { StockListResults } from '../../components/stock/stock-list-results';

import { DashboardLayout } from '../../components/dashboard-layout';

import StockProvider from '../../services/stock-provider';

import {CONNECTION_ERROR, AUTHORIZATION_ERROR} from '../../utils/constants'

import UXAccess from '../../utils/ux-access';


class Stock extends React.Component{
  
  constructor(props){
    super(props);

    

    this.state = {
      stocks: [],
      nextPageUrl: '',
      storeId :props.router.query.id,
      loading: true,
      errorSBOpen: false,
      loadingOpen: true,
      errorSBText: ""
    };

  }

  componentDidMount(){

    this.setState({loadingOpen:true,...this.state})
    if(this.state.storeId){
      if (UXAccess.hasStoreAccess()){
        StockProvider.getStocksByStore(this.state.storeId).then(
          (response) => {
            console.log(response.data)
            this.setState({loadingOpen:false, stocks : response.data, loading: false})
          },
          error => {
            this.setState({loadingOpen:false})
            this.handleSBOpen(CONNECTION_ERROR)
          }
        )
      }else{
        this.setState({loadingOpen:false})
        this.handleSBOpen(AUTHORIZATION_ERROR)
      }

      
    }else{
      StockProvider.getStocksByUserLocation().then(
        (response)=>{
          this.setState({loadingOpen:false, stocks : response.data, loading: false})
        },
        (error)=>{
          this.setState({loadingOpen:false})
          this.handleSBOpen(CONNECTION_ERROR)
        })
    }

  }

  handleSBClose(){
    this.setState({errorSBOpen:false})
  }

  handleSBOpen(text){
    this.setState({errorSBOpen:true, errorSBText:text})

  }

  getLayout(page){

  }

  render() {
  
    return ( 
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
              Stock| Material Kit
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
              <StockListToolbar store={this.state.stocks[0].store}/>
              <StockListResults stockList={this.state.stocks[0].id ? this.state.stocks : []} />
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

const StockWrapper = withRouter(Stock)

StockWrapper.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);


export default StockWrapper;
