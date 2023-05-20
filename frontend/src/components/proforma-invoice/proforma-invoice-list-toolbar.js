import { useState, useEffect } from 'react';
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
    FormControl
} from '@mui/material';

import { Positive as PositiveIcon } from '../../icons/positive';


export const ProformaInvoiceListToolbar = (props,) => {


    return (
        <Box {...props}>
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    m: -1,
                    mb: 2
                }}
            >
                <Typography
                    sx={{ m: 1 }}
                    variant="h4"
                >
                    FACTURE PROFORMA
                </Typography>
                <Box sx={{ m: 1 }}>

                    <Button
                        color="primary"
                        variant="contained"
                        href='proforma-invoice/add-proforma-invoice'
                        startIcon={(<PositiveIcon />)}
                    >
                        Ajouter une facture proforma
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}
