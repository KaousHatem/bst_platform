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

export const PRAddToolbar = ({props, isAddPage=false, handleReject, handleApprove , purchaseRequestStatus, purchaseRequestId , handleSaveAsDraft}) => {

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
    if(purchaseRequestId){
      // const data = {
      //  pathname: '/provision/print-provision',
      //  query:{'id':purchaseRequestId}
      // }
      // router.push(data);
      const url = '/purchase-request/print?id='+purchaseRequestId
      window.open(url, "_blank")
    }

    
    
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
        DEMANDE D'ACHAT
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
          {(!purchaseRequestStatus || purchaseRequestStatus==='0') && <MenuItem 
            onClick={(event) => handleSaveAsDraft(event,0)}
          >
            <AssignmentReturnedIcon />
            Enregistrer comme brouillon
          </MenuItem>}
          { !isAddPage && (!purchaseRequestStatus || purchaseRequestStatus!=='0' ) && <MenuItem 
            onClick={(event) => handlePrint(event)}
          >
            <PrintIcon />
            Imprimer la demande
          </MenuItem>}
          { !isAddPage && (purchaseRequestStatus!=='0' && purchaseRequestStatus!=="9") && UXAccess.hasProvisionRejectAccess() && <MenuItem 
            onClick={handleReject}
          >
            <CancelIcon />
            Rejecter la demande
          </MenuItem>}
        </StyledMenu>
        { (!purchaseRequestStatus || purchaseRequestStatus==='0') && <Button
          color="info"
          variant="contained"
          form="add-purchase-request-form"
          type = "submit"
          startIcon={(<PositiveIcon />)}
          sx={{ mr: 1 }}
        >
          Confirmer
        </Button>}
        { !isAddPage && UXAccess.hasPurchaseRequestApproveAccess() && (purchaseRequestStatus!=='0' && purchaseRequestStatus!=='4' && purchaseRequestStatus!=='9') && <Button
          color="info"
          variant="contained"
          onClick={handleApprove}
          sx={{ mr: 1 }}
        >
          Approver
        </Button>}
      </Box>
    </Box>
    {/*<Box sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          <Box sx={{ maxWidth: 500 }}>
            
          </Box>
        </CardContent>
      </Card>
    </Box>*/}
  </Box>)
  
}
  
