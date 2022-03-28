import Head from 'next/head';
import React from 'react';
import { Box, Container, Grid, Pagination } from '@mui/material';
 
import { DashboardLayout } from '../../components/dashboard-layout';

import { UserListToolbar } from '../../components/user/user-list-toolbar'
import { UserListResults } from '../../components/user/user-list-result'

import UserProvider from '../../services/user-provider'

class Users extends React.Component{
    
  constructor(props){
    super(props);

    this.state = {
      users: [],
      nextPageUrl: '',
      loading: true
    };

  }

  componentDidMount(){

    UserProvider.getUsers().then(
      response => {
        console.log(response.data)
        this.setState({users : response.data, loading: false})
      }
      )
    
  }

  render() {
    return( this.state.loading == false &&
      <>
        <Head>
          <title>
            Provisions | Material Kit
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
            <UserListToolbar />
            <UserListResults user_list={this.state.users} />
          </Container>
          
        </Box>
      </>
      );
  }
  
}

Users.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Users;
