import Head from 'next/head';
import React from 'react';
import { Box, Container, Grid, Pagination } from '@mui/material';
import { PRListToolbar } from '../../components/purchase-request/pr-list-toolbar';
import { PRListResults } from '../../components/purchase-request/pr-list-results';  
import { DashboardLayout } from '../../components/dashboard-layout';
import PurchaseRequestProvider from '../../services/purchase-request-provider';

class PurchaseRequest extends React.Component{
    
  constructor(props){
    super(props);

    this.state = {
      purchaseRequests: [],
      nextPageUrl: '',
      loading: true
    };

  }

  componentDidMount(){
    PurchaseRequestProvider.getPurchaseRequests().then(
      (response) => {
        console.log(response.data)
        this.setState({purchaseRequests : response.data, loading: false})
      }
    )
  }

  render() {
    return( this.state.loading == false &&
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
