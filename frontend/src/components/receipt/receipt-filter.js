import { useState, useEffect, Fragment } from 'react';
import { format } from 'date-fns'
import {
    Box,
    Button,
    Card,
    CardContent,
    CardAction,
    TextField,
    InputAdornment,
    SvgIcon,
    Typography,
    Collapse,
    Grid,
    InputLabel,
    Select,
    MenuItem,
    FormControl,

} from '@mui/material';
import DateRangePicker from '@mui/lab/DateRangePicker';
import { Download as DownloadIcon } from '../../icons/download';
import { Search as SearchIcon } from '../../icons/search';
import { Upload as UploadIcon } from '../../icons/upload';
import { Positive as PositiveIcon } from '../../icons/positive';
import FilterAltIcon from '@mui/icons-material/FilterAlt';




export const ReceiptFilter = ({ receipts, setFilteredReceipt, setPage, setLimit, ...props }) => {



    const handleSearch = (e) => {

        const filterList = receipts.filter((receipt) => {
            return (receipt.purchaseOrder.ref.includes(e.target.value))

        })
        setPage(0)
        setLimit(10)
        setFilteredReceipt(filterList)


    }




    return (
        <Box {...props}>
            <Box sx={{ mb: 3 }}>
                <Card >
                    <CardContent>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                        }}>
                            <TextField
                                sx={{
                                    maxWidth: 400
                                }}
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SvgIcon
                                                color="action"
                                                fontSize="small"
                                            >
                                                <SearchIcon />
                                            </SvgIcon>
                                        </InputAdornment>
                                    )
                                }}
                                placeholder="Rechercher par bon de commande"
                                variant="outlined"
                                onChange={e => { handleSearch(e) }}
                            />
                        </Box>
                    </CardContent>

                </Card>
            </Box>
        </Box>
    )
}
