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

import { StockInListToolbar } from '../../components/stock-in/stock-in-list-toolbar';
import { StockInListResults } from '../../components/stock-in/stock-in-list-results';

import { DashboardLayout } from '../../components/dashboard-layout';

import StockInDocumentProvider from '../../services/stock-in-document-provider';
import StoreProvider from 'src/services/store-provider';

import { CONNECTION_ERROR, AUTHORIZATION_ERROR } from '../../utils/constants'

import UXAccess from '../../utils/ux-access';


class StockInDocument extends React.Component {

    constructor(props) {
        super(props);



        this.state = {
            stockInDocuments: [],
            nextPageUrl: '',
            loading: true,
            errorSBOpen: false,
            loadingOpen: true,
            errorSBText: ""
        };

    }

    componentDidMount() {

        this.setState({ loadingOpen: true, ...this.state })
        Promise.all([
            UXAccess.hasAccessAllStockInDocument() && StoreProvider.getStores(),
            !UXAccess.hasAccessAllStockInDocument() && StockInDocumentProvider.getStockInDocuments()]).then(
                (responses) => {
                    console.log(responses)
                    if (responses[0]) {
                        this.setState({ loadingOpen: false, stores: responses[0].data, loading: false })
                    }
                    if (responses[1]) {
                        this.setState({ loadingOpen: false, stockInDocuments: responses[1].data, loading: false })
                    }
                },
                (errors) => {
                    this.setState({ loadingOpen: false })
                    this.handleSBOpen(CONNECTION_ERROR)
                })


    }

    handleSBClose() {
        this.setState({ errorSBOpen: false })
    }

    handleSBOpen(text) {
        this.setState({ errorSBOpen: true, errorSBText: text })

    }

    getLayout(page) {

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
                            <Container maxWidth={false}>
                                <StockInListToolbar store={UXAccess.hasAccessAllStockInDocument() ? "" : this.state.stockInDocuments.length > 0 ? this.state.stockInDocuments[0].store : ""} />
                                <StockInListResults stockInList={this.state.stockInDocuments} storeList={this.state.stores} />
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

const StockWrapper = withRouter(StockInDocument)

StockWrapper.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);


export default StockWrapper;
