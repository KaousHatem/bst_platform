import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, Button, Avatar, Divider, Drawer, Typography, useMediaQuery, Popover, ListItem, MenuList, MenuItem } from '@mui/material';
import { UserCircle as UserCircleIcon } from '../icons/user-circle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ChartBar as ChartBarIcon } from '../icons/chart-bar';
import { Cog as CogIcon } from '../icons/cog';
import { Lock as LockIcon } from '../icons/lock';
import { Selector as SelectorIcon } from '../icons/selector';
import { ShoppingBag as ShoppingBagIcon } from '../icons/shopping-bag';
import { User as UserIcon } from '../icons/user';
import { UserAdd as UserAddIcon } from '../icons/user-add';
import { Users as UsersIcon } from '../icons/users';
import { XCircle as XCircleIcon } from '../icons/x-circle';
import { ChartHistBar as ChartHistBarIcon } from '../icons/chart-hist';
import { Box as BoxIcon } from '../icons/box';
import { Trucks as TrucksIcon } from '../icons/trucks';
import { Copy as CopyIcon } from '../icons/copy';
import { Exit as ExitIcon } from '../icons/exit';
import { Logout as LogoutIcon } from '../icons/logout';
import { Project as ProjectIcon } from '../icons/project';
import { Logo } from './logo';
import { NavItem } from './nav-item';
import { SubNavItem } from './sub-nav-item';


import AuthProvider from '../services/auth-provider';

import UXAccess from '../utils/ux-access';


export const DashboardSidebar = (props) => {

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [anchorElLog, setAnchorElLog] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick1 = (event) => {
    setAnchorEl1(event.currentTarget);
  };

  const handleClickLog = (event) => {
    setAnchorElLog(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClose1 = () => {
    setAnchorEl1(null);
  };

  const handleCloseLog = () => {
    setAnchorElLog(null);
  };

  const openPop = Boolean(anchorEl);
  const id = openPop ? 'simple-popover' : undefined;

  const openPop1 = Boolean(anchorEl1);
  const id1 = openPop1 ? 'simple-popover' : undefined;

  const openPopLog = Boolean(anchorElLog);
  const idLog = openPopLog ? 'simple-popover' : undefined;

  const { open, onClose } = props;
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false
  });

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (open) {
        onClose?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  );

  const handleLgout = (e, href) => {
    console.log(href)
    if (href === '/login') {
      AuthProvider.logout()
    }

  }


  const content = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <div>

          <Box sx={{ px: 2 }}>
            <Box
              sx={{
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                px: 3,
                py: '11px',
                borderRadius: 1,
                mt: 2
              }}
            >
              <UserCircleIcon sx={{
                height: 100,
                width: 100,
                ml: 1
              }} />

            </Box>
          </Box>
        </div>
        <Divider
          sx={{
            borderColor: '#2D3748',
            my: 3
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <NavItem
            key='Tableau de Bord'
            icon={(<ChartHistBarIcon fontSize="large" />)}
            href="/"
            title='Tableau de Bord'
          />
          <NavItem
            key='Stock'
            icon={(<CopyIcon fontSize="large" />)}
            // href="/products/list-product"
            title="Stock"
            aria-describedby={id1}
            onClick={handleClick1}
          />
          <Popover
            id={id}
            sx={{
              ml: 1.5
            }}
            open={openPop1}
            anchorEl={anchorEl1}
            onClose={handleClose1}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'left',
            }}
            disableRestoreFocus
            marginThreshold={20}
          >
            <Box
              sx={{
                backgroundColor: 'neutral.900',
                color: '#FFFFFF',

              }}
            >
              <MenuList>
                {UXAccess.hasProductAccess() && <SubNavItem href='/products'
                  title='Articles' />}
                {UXAccess.hasProductAccess() && <SubNavItem href='/category'
                  title='Categories' />}
                <SubNavItem href={UXAccess.hasStoreAccess() ? '/store' : '/stock'}
                  title='Inventaire' />
                <SubNavItem href='/transfer'
                  title='Transfert'
                />
                <SubNavItem href='/stock-in'
                  title="Bon d'entré" />
                <SubNavItem href='/stock-out'
                  title="Bon de sortie" />
              </MenuList>
            </Box>

          </Popover>


          <NavItem
            key='Logistique'
            icon={(<TrucksIcon fontSize="large" />)}
            // href="/provision"
            title='Logistique'
            aria-describedby={idLog}
            onClick={handleClickLog}
          />

          <Popover
            id={idLog}
            sx={{
              ml: 1.5
            }}
            open={openPopLog}
            anchorEl={anchorElLog}
            onClose={handleCloseLog}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'left',
            }}
            disableRestoreFocus
            marginThreshold={20}
          >
            <Box
              sx={{
                backgroundColor: 'neutral.900',
                color: '#FFFFFF',

              }}
            >
              <MenuList>
                <SubNavItem href='/provision'
                  title='Approvisionnement' />
                {UXAccess.hasPOAccess() && <SubNavItem href='/purchase-request'
                  title='Achat' />}
                <SubNavItem href='/purchase-order'
                  title='Bon de commande' />
                <SubNavItem href='/receipt'
                  title='Bon de reception' />
                {UXAccess.hasSupplierAccess() && <SubNavItem href='/supplier'
                  title='Fournisseur' />}
                {UXAccess.hasProformaRequest() && <SubNavItem href='/proforma-request'
                  title='Demande Facture Proforma' />}
                {UXAccess.hasProformaInvoice() && <SubNavItem href='/proforma-invoice'
                  title='Facture Proforma' />}
              </MenuList>
            </Box>

          </Popover>


          {UXAccess.hasCategoryAccess() && <NavItem
            key='Projets'
            icon={(<ProjectIcon fontSize="large" />)}
            // href="#"
            title='Projets'
            aria-describedby={id}
            onClick={handleClick}
          />

          }
          <Popover
            id={id}
            sx={{
              ml: 1.5
            }}
            open={openPop}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'left',
            }}
            disableRestoreFocus
            marginThreshold={20}
          >
            <Box
              sx={{
                width: 100,
                backgroundColor: 'neutral.900',
                color: '#FFFFFF',

              }}
            >
              <MenuList>
                <SubNavItem href='/project/location'
                  title='Sites' />
              </MenuList>
            </Box>

          </Popover>
          <NavItem
            key='Se Deconnecter'
            icon={(<LogoutIcon fontSize="large" />)}
            href="/login"
            title='Se Deconnecter'
            onClick={() => { AuthProvider.logout() }}
          />
        </Box>
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            color: '#FFFFFF',
            width: '300px'
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 320
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
