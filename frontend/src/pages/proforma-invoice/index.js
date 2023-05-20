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

import ProformaInvoiceProvider from 'src/services/proforma-invoice-provider';
import { ProformaInvoiceListToolbar } from 'src/components/proforma-invoice/proforma-invoice-list-toolbar';
import { ProformaInvoiceListResults } from 'src/components/proforma-invoice/proforma-invoice-list-result';

class ProformaInvoice extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            proformaInvoices: [],
            nextPageUrl: '',
            loading: true,
            errorSBOpen: false,
            loadingOpen: true,
            errorSBText: ""
        };

    }

    componentDidMount() {
        this.setState({ loadingOpen: true, ...this.state })
        ProformaInvoiceProvider
            .getProformaInvoices()
            .then(
                (response) => {
                    console.log(response.data)
                    this.setState({ loadingOpen: false, proformaInvoices: response.data, loading: false })
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
                                FACTURE PROFORMA | Material Kit
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
                                <ProformaInvoiceListToolbar />
                                <ProformaInvoiceListResults proformaInvoiceList={this.state.proformaInvoices} />
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

ProformaInvoice.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default ProformaInvoice;
