import Head from 'next/head';
import React from 'react';
import { Box, Container, Grid, Pagination } from '@mui/material';
import { LocationListToolbar } from '../../../components/project/location/location-list-toolbar';
import { LocationListResults } from '../../../components/project/location/location-list-results';  
import { DashboardLayout } from '../../../components/dashboard-layout';
import LocationProvider from '../../../services/location-provider';

class Locations extends React.Component{
    
  constructor(props){
    super(props);

    this.state = {
      locations: [],
      nextPageUrl: '',
      loading: true
    };

  }

  componentDidMount(){
    LocationProvider.getLocations().then(
      (response) => {
        console.log(response.data)
        this.setState({locations : response.data, loading: false})
      }
    )
  }

  render() {
    return( this.state.loading == false &&
      <>
        <Head>
          <title>
            Sites | Material Kit
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
            <LocationListToolbar />
            <LocationListResults location_list={this.state.locations} />
          </Container>
          
        </Box>
      </>
      );
  }
  
}

Locations.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Locations;
