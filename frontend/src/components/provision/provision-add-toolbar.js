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

export const ProvisionAddToolbar = ({ props, isAddPage = false, handleRejectOpen, handleApprove, provisionStatus, provisionId, handleSaveAsDraft, hasPurchaseRequest = false, }) => {

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
    if (provisionId) {
      const url = '/provision/print-provision?id=' + provisionId
      window.open(url, "_blank")
    }

  }

  const handleAddPurchaseRequest = () => {
    if (provisionId) {
      const data = {
        pathname: '/purchase-request/add-purchase-request',
        query: { 'provisionId': provisionId }
      }
      router.push(data);
    }
  }


  return (<Box {...props}>
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
        DEMANDE D&apos;APPRO
      </Typography>
      <Box sx={{ m: 1 }}>
        <Button
          color="primary"
          variant="outlined"
          href='/provision'
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
          {(!provisionStatus || provisionStatus === '0') && <MenuItem
            onClick={(event) => handleSaveAsDraft(event, 0)}
          >
            <AssignmentReturnedIcon />
            Enregistrer comme brouillon
          </MenuItem>}
          {!isAddPage && (!provisionStatus || provisionStatus !== '0') && <MenuItem
            onClick={(event) => handlePrint(event)}
          >
            <PrintIcon />
            Imprimer la demande
          </MenuItem>}
          {!isAddPage && !hasPurchaseRequest && (provisionStatus !== '0' && provisionStatus !== "4") && UXAccess.hasProvisionRejectAccess() && <MenuItem
            onClick={handleRejectOpen}
          >
            <CancelIcon />
            Annuler la demande
          </MenuItem>}
          {!isAddPage && !hasPurchaseRequest && (provisionStatus !== '0' && provisionStatus !== "1" && provisionStatus !== "4") && UXAccess.hasProvisionApproveAccess() && <MenuItem
            onClick={handleAddPurchaseRequest}
          >
            <InsertDriveFileIcon />
            Creer une demande d&apos;achat
          </MenuItem>}

        </StyledMenu>
        {(!provisionStatus || provisionStatus === '0') && <Button
          color="info"
          variant="contained"
          form="add-provision-form"
          type="submit"
          startIcon={(<PositiveIcon />)}
          sx={{ mr: 1 }}
        >
          Confirmer
        </Button>}
        {!isAddPage && UXAccess.hasProvisionApproveAccess() && (provisionStatus !== '0' && provisionStatus !== '4' && provisionStatus !== '9') && <Button
          color="info"
          variant="contained"
          onClick={handleApprove}
          sx={{ mr: 1 }}
        >
          Approuver
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

