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


import { CONNECTION_ERROR } from '../../utils/constants'

import TransferProvider from 'src/services/transfer-provider';
import { TransferListResults } from 'src/components/transfer/transfer-list-result';
import { TransferListToolbar } from 'src/components/transfer/transfer-list-toolbar';

class Transfer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            transfers: [],
            nextPageUrl: '',
            loading: true,
            errorSBOpen: false,
            loadingOpen: true,
            errorSBText: ""
        };

    }

    componentDidMount() {
        this.setState({ loadingOpen: true, ...this.state })
        TransferProvider
            .getTransfers()
            .then(
                (response) => {
                    console.log(response.data)
                    this.setState({ loadingOpen: false, transfers: response.data, loading: false })
                },
                error => {
                    this.setState({ loadingOpen: false })
                    this.handleSBOpen(CONNECTION_ERROR)
                }
            )
    }

    handleSBClose() {
        this.setState({ errorSBOpen: false })
    }

    handleSBOpen(text) {
        this.setState({ errorSBOpen: true, errorSBText: text })

    }

    render() {
        return (
            <>
                {this.state.loading === true &&
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={this.state.loadingOpen}
                        onClick={() => { setLoadingOpen(false) }}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop> ||
                    <>
                        <Head>
                            <title>
                                TRANSFERTS | Material Kit
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
                                <TransferListToolbar />
                                <TransferListResults transferList={this.state.transfers} />
                            </Container>

                        </Box>

                    </>}
                <Snackbar open={this.state.errorSBOpen}
                    onClose={() => this.handleSBClose()}>
                    <Alert variant="filled"
                        severity="error">
                        {this.state.errorSBText}
                    </Alert>
                </Snackbar>
            </>
        );
    }

}

Transfer.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Transfer;
