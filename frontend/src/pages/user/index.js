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
      loading: true,
      errorSBOpen: false,
      loadingOpen: true,
      errorSBText: ""
    };

  }

  componentDidMount(){
    this.setState({loadingOpen:true,...this.state})
    UserProvider.getUsers().then(
      response => {
        console.log(response.data)
        this.setState({loadingOpen:false, users : response.data, loading: false})
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
      }
      <Snackbar open={this.state.errorSBOpen} 
      onClose={()=>this.handleSBClose()}>
        <Alert variant="filled" 
        severity="error">
          {this.state.errorSBText}
        </Alert>
      </Snackbar>
      
      </>);
  }
  
}

Users.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Users;
