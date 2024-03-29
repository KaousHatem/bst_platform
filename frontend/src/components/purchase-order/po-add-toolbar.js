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

export const POAddToolbar = ({props, isAdd = true ,id, received=false, confirmed=false }) => {

  const router = useRouter();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handlePrint = () => {
    if(id){
      const url = '/purchase-order/print?id='+id
      window.open(url, "_blank")
    }
  }

  const handleReceipt = () => {
    const data = {
     pathname: '/receipt/add-receipt',
     query:{'id':id}
    }
    router.push(data);
  }


  const handleBackButton = (e) => {
    router.back()
  }


  return(<Box {...props}>
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
        BON DE COMMANDE
      </Typography>
      <Box sx={{ m: 1 }}>
        <Button
          color="primary"
          variant="outlined"
          onClick={(event) => {handleBackButton(event)}}
          sx={{ mr: 4 }}
        >
          Retour
        </Button>
        { !isAdd && <> <Button
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
          Action
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
          <MenuItem onClick={(event) => handlePrint(event)} >
            <PrintIcon />
            Imprimer la demande
          </MenuItem>
          {!received && <MenuItem onClick={(event) => handleReceipt(event)} >
            <ReceiptIcon />
            Accuser la réception
          </MenuItem> }
          
          {/*<MenuItem >
            <PrintIcon />
            Approver le bon de commande
          </MenuItem>*/}
        </StyledMenu>
        </>
      }
        { (UXAccess.hasPOupdateAccess() && !confirmed) && <Button
          color="info"
          variant="contained"
          form="add-purchase-order-form"
          type = "submit"
          startIcon={(<PositiveIcon />)}
          sx={{ mr: 1 }}
        >
          Confirmer
        </Button>}

        
        
      </Box>
    </Box>
  </Box>)
  
}
  
