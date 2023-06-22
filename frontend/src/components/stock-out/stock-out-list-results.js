import { useState, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import {
    Avatar,
    Box,
    Card,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
    Menu,
    MenuItem,
    Tabs,
    Tab,
    TabPanel,
    Backdrop,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';
import { getInitials } from '../../utils/get-initials';

import { ThreeDots as ThreeDotsIcon } from '../../icons/three-dots'
import { Edit as EditIcon } from '../../icons/edit'
import { Delete as DeleteIcon } from '../../icons/delete'
import { View as ViewIcon } from '../../icons/view'

import { StockOutListToolbar } from './stock-out-list-toolbar';


import UXAccess from '../../utils/ux-access'
import StockOutDocumentProvider from '../../services/stock-out-document-provider';


import Label from '../Label';
import UserProvider from 'src/services/user-provider';

export const StockOutListResults = ({ stockOutList, storeList, ...rest }) => {

    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(0);

    const router = useRouter();

    let [loading, setLoading] = useState(true)

    let [errorSBOpen, setErrorSBOpen] = useState(false)
    let [errorSBText, setErrorSBText] = useState("")

    let [location, setLocation] = useState()
    let [storeLocation, setStoreLocation] = useState(storeList ? storeList[0].location : undefined)

    const CONNECTION_ERROR = "Probleme de connexion, Veuillez de ressayer"


    let [stockOutDocuments, setStockOutDocuments] = useState(stockOutList)
    const source_text = {
        3: "Chantier",
        4: "Autre"
    }
    const status_text = {
        1: "Nouveau",
        999: "Complété"
    }

    const status_style = {
        1: ['filled', 'primary'],
        999: ['filled', 'secondary'],
    }

    const [value, setValue] = useState(storeList ? storeList[0].id : undefined);

    const handleChange = (event, newValue) => {
        console.log(newValue)
        setValue(newValue);
        setStoreLocation(storeList.find(store => { return store.id === newValue }).location)
    };
    const handleLimitChange = (event) => {
        setLimit(event.target.value);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleClickEdit = (e, id) => {

        const data = {
            pathname: '/stock-out/edit-stock-out-document/',
            query: { 'id': id }
        }
        router.push(data);
    }

    useEffect(() => {
        setLoading(true)
        setPage(0)
        setLimit(10)
        Promise.all([
            StockOutDocumentProvider.getStockOutDocumentsByStore(value),
            UserProvider.getMeUser()]).then(
                (responses) => {
                    setStockOutDocuments(responses[0].data)
                    setLocation(responses[1].data.location)
                    setLoading(false)

                },
                (errors) => {
                    setLoading(false)
                    handleSBOpen(CONNECTION_ERROR)
                })

    }, [value])

    const handleSBClose = () => {
        setErrorSBOpen(false)
    }

    const handleSBOpen = (text) => {
        setErrorSBText(text)
        setErrorSBOpen(true)
    }



    return (
        <Box {...rest}>
            <StockOutListToolbar isSameLocation={location ? location === storeLocation : true} store={UXAccess.hasAccessAllStockOutDocument() ? "" : stockOutList.length > 0 ? stockOutList[0].store : ""} />
            {UXAccess.hasAccessAllStockOutDocument() && <Box sx={{ maxWidth: { xs: "100%", sm: "100%" }, bgcolor: 'background.paper' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                >
                    {storeList.map(store => (
                        <Tab key={store.id}
                            value={store.id}
                            label={store.name} />
                    ))}


                </Tabs>
            </Box>}
            {loading ?
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop> :
                <>
                    <PerfectScrollbar>
                        <Box sx={{ minWidth: "100%" }} >
                            <Table>
                                <TableHead sx={{
                                    backgroundColor: '#F4F7FC',
                                    textAlign: 'center'
                                }} >
                                    <TableRow>
                                        <TableCell>
                                            Reference
                                        </TableCell>
                                        <TableCell >
                                            Magasin
                                        </TableCell>
                                        <TableCell>
                                            Date de sortie
                                        </TableCell>
                                        <TableCell >
                                            Crée par
                                        </TableCell>
                                        <TableCell>
                                            Destination
                                        </TableCell>
                                        <TableCell align="center">
                                            Status
                                        </TableCell>
                                        <TableCell align="center">
                                            <ThreeDotsIcon />
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {stockOutDocuments.slice(page * limit, page * limit + limit).map((stockOutDocument) => (
                                        <TableRow
                                            hover
                                            key={stockOutDocument.id}
                                        >

                                            <TableCell>
                                                {stockOutDocument.ref}
                                            </TableCell>
                                            <TableCell>
                                                {stockOutDocument.store.name}
                                            </TableCell>
                                            <TableCell>
                                                {format(new Date(stockOutDocument.created_on), 'dd/MM/yyyy')}
                                            </TableCell>
                                            <TableCell>
                                                {stockOutDocument.created_by.fullname}
                                            </TableCell>
                                            <TableCell>
                                                {source_text[stockOutDocument.target]}
                                            </TableCell >

                                            <TableCell align="center">
                                                <Label
                                                    variant={status_style[stockOutDocument.status][0]}
                                                    color={status_style[stockOutDocument.status][1]}
                                                >
                                                    {status_text[stockOutDocument.status]}
                                                </Label>
                                            </TableCell >
                                            <TableCell
                                            >
                                                <Box
                                                    align="center"
                                                    sx={{
                                                        justifyContent: 'center',
                                                        display: 'flex'
                                                    }}
                                                >
                                                    <ViewIcon
                                                        sx={{
                                                            mx: 1,
                                                            cursor: "pointer"
                                                        }}
                                                        onClick={(event) => { handleClickEdit(event, stockOutDocument.id) }}
                                                    />

                                                </Box>

                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {stockOutDocuments.length === 0 &&
                                        <TableRow>
                                            <TableCell colSpan={7}
                                                align="center" >
                                                Aucun Bon de sortie existe
                                            </TableCell>
                                        </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </Box>
                    </PerfectScrollbar>
                </>}
            <TablePagination
                component="div"
                count={stockOutDocuments.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[10, 25, 50]}
            />


        </Box>


    );
};










