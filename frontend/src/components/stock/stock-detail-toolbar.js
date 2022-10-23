import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
  Menu,
  MenuItem
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { Download as DownloadIcon } from '../../icons/download';
import { Search as SearchIcon } from '../../icons/search';
import { Upload as UploadIcon } from '../../icons/upload';
import { Positive as PositiveIcon } from '../../icons/positive';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PrintIcon from '@mui/icons-material/Print';
import CancelIcon from '@mui/icons-material/Cancel';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ReceiptIcon from '@mui/icons-material/Receipt';

import UXAccess from '../../utils/ux-access'


const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 280,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],

    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

export const StockDetailToolbar = ({props, stockId }) => {

  const router = useRouter();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleStockIn = () => {
    const data = {
     pathname: '/stock-in/add-stock-in',
     query:{'stockId':stockId}
    }
    router.push(data);
  }

  const handleStockOut = () => {
    const data = {
     pathname: '/stock-out/add-stock-out',
     query:{'stockId':stockId}
    }
    router.push(data);
  }

  const handleStockInit = () => {
    const data = {
     pathname: '/stock-init/add-stock-init',
     query:{'stockId':stockId}
    }
    router.push(data);
  }


  return(
    <Box {...props}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          m: -1
        }}
      >
        <Typography
          sx={{ m: 1 }}
          variant="h4"
        >
          BST STOCK
        </Typography>
        <Box sx={{ m: 1 }}>
          
          <Button
            id='action-btn'
            color="primary"
            variant="contained"
            sx={{ mr: 2 }}
            aria-haspopup="true"
            aria-controls={menuOpen ? 'action-menu' : undefined}
            aria-expanded={menuOpen ? 'true' : undefined}
            onClick={(event) => handleClickMenu(event)}
            endIcon={<KeyboardArrowDownIcon />}
          >
            Ajouter Mouvement
          </Button>
          <StyledMenu
            id="action-menu"
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleCloseMenu}
            MenuListProps={{
              'aria-labelledby': 'action-btn',
            }}
          >
            <MenuItem onClick={(event) => handleStockIn(event)} >
              Bon d'entré
            </MenuItem> 
            <MenuItem onClick={(event) => handleStockOut(event)} >
              Bon de sortie
            </MenuItem>
            <MenuItem onClick={(event) => handleStockInit(event)} >
              Initialiser
            </MenuItem>
          </StyledMenu>
        </Box>
      </Box>
    </Box>)
  
}
  
