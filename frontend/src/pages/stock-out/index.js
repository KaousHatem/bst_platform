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

import { CONNECTION_ERROR, AUTHORIZATION_ERROR } from '../../utils/constants'

import UXAccess from '../../utils/ux-access';


class StockOutDocument extends React.Component {

    constructor(props) {
        super(props);



        this.state = {
            stockOutDocuments: [],
            nextPageUrl: '',
            storeId: props.router.query.id,
            loading: true,
            errorSBOpen: false,
            loadingOpen: true,
            errorSBText: ""
        };

    }

    componentDidMount() {

        this.setState({ loadingOpen: true, ...this.state })
        if (this.state.storeId) {
            if (UXAccess.hasStoreAccess()) {
                StockOutDocumentProvider.getStockOutDocumentsByStore(this.state.storeId).then(
                    (response) => {
                        console.log(response.data)
                        this.setState({ loadingOpen: false, stockOutDocuments: response.data, loading: false })
                    },
                    error => {
                        this.setState({ loadingOpen: false })
                        this.handleSBOpen(CONNECTION_ERROR)
                    }
                )
            } else {
                this.setState({ loadingOpen: false })
                this.handleSBOpen(AUTHORIZATION_ERROR)
            }


        } else {
            StockOutDocumentProvider.getStockOutDocuments().then(
                (response) => {
                    console.log(response.data)
                    this.setState({ loadingOpen: false, stockOutDocuments: response.data, loading: false })
                },
                (error) => {
                    this.setState({ loadingOpen: false })
                    this.handleSBOpen(CONNECTION_ERROR)
                })
        }

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
                                <StockOutListToolbar store={this.state.stockOutDocuments.length > 0 ? this.state.stockOutDocuments[0].store : ""} />
                                <StockOutListResults stockOutList={this.state.stockOutDocuments} />
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
