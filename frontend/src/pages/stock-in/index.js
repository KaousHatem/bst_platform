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

import { CONNECTION_ERROR, AUTHORIZATION_ERROR } from '../../utils/constants'

import UXAccess from '../../utils/ux-access';


class StockInDocument extends React.Component {

    constructor(props) {
        super(props);



        this.state = {
            stockInDocuments: [],
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
                StockInDocumentProvider.getStockInDocumentsByStore(this.state.storeId).then(
                    (response) => {
                        console.log(response.data)
                        this.setState({ loadingOpen: false, stockInDocuments: response.data, loading: false })
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
            StockInDocumentProvider.getStockInDocuments().then(
                (response) => {
                    console.log(response.data)
                    this.setState({ loadingOpen: false, stockInDocuments: response.data, loading: false })
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
                                <StockInListToolbar store={this.state.stockInDocuments.length > 0 ? this.state.stockInDocuments[0].store : ""} />
                                <StockInListResults stockInList={this.state.stockInDocuments} />
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
