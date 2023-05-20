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

import { ProformaRequestListToolbar } from 'src/components/proforma-request/proforma-request-list-toolbar';

import { DashboardLayout } from '../../components/dashboard-layout';

import ProformaRequestProvider from '../../services/proforma-request-provider';

import { CONNECTION_ERROR } from '../../utils/constants'
import { ProformaRequestListResults } from '../../components/proforma-request/proforma-request-list-results';

class ProformaRequest extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            proformaRequests: [],
            nextPageUrl: '',
            loading: true,
            errorSBOpen: false,
            loadingOpen: true,
            errorSBText: ""
        };

    }

    componentDidMount() {
        this.setState({ loadingOpen: true, ...this.state })
        ProformaRequestProvider
            .getProformaRequests()
            .then(
                (response) => {
                    console.log(response.data)
                    this.setState({ loadingOpen: false, proformaRequests: response.data, loading: false })
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
                                DEMANDE FACTURE PROFORMA | Material Kit
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
                                <ProformaRequestListToolbar />
                                <ProformaRequestListResults proformaRequestList={this.state.proformaRequests} />
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

ProformaRequest.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default ProformaRequest;
