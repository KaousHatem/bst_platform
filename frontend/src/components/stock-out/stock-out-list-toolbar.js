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


export const StockOutListToolbar = (props,) => {


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
                    Bon de sortie {props.store.name}
                </Typography>
                <Box sx={{ m: 1 }}>

                    <Button
                        color="primary"
                        variant="contained"
                        href='stock-out/add-stock-out-document'
                        startIcon={(<PositiveIcon />)}
                        disabled={!props.isSameLocation}
                    >
                        Ajouter un bon de sortie
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}
