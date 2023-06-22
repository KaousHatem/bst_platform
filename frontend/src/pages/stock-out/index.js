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

import { StockOutListToolbar } from '../../components/stock-out/stock-out-list-toolbar';
import { StockOutListResults } from '../../components/stock-out/stock-out-list-results';

import { DashboardLayout } from '../../components/dashboard-layout';

import StockOutDocumentProvider from '../../services/stock-out-document-provider';
import StoreProvider from 'src/services/store-provider';

import { CONNECTION_ERROR, AUTHORIZATION_ERROR } from '../../utils/constants'

import UXAccess from '../../utils/ux-access';


class StockOutDocument extends React.Component {

    constructor(props) {
        super(props);



        this.state = {
            stockOutDocuments: [],
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
            !UXAccess.hasAccessAllStockInDocument() && StockOutDocumentProvider.getStockOutDocuments()]).then(
                (responses) => {
                    console.log(responses)
                    if (responses[0]) {
                        this.setState({ loadingOpen: false, stores: responses[0].data, loading: false })
                    }
                    if (responses[1]) {
                        this.setState({ loadingOpen: false, stockOutDocuments: responses[1].data, loading: false })
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
                                {/* <StockOutListToolbar store={UXAccess.hasAccessAllStockOutDocument() ? "" : this.state.stockOutDocuments.length > 0 ? this.state.stockOutDocuments[0].store : ""} /> */}
                                <StockOutListResults stockOutList={this.state.stockOutDocuments} storeList={this.state.stores} />
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

const StockWrapper = withRouter(StockOutDocument)

StockWrapper.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);


export default StockWrapper;
