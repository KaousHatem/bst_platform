import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, Button,Avatar, Divider, Drawer, Typography, useMediaQuery } from '@mui/material';
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
import { Trucks as TrucksIcon} from '../icons/trucks';
import { Copy as CopyIcon} from '../icons/copy';
import { Exit as ExitIcon} from '../icons/exit';
import { Logout as LogoutIcon} from '../icons/logout';
import { Logo } from './logo';
import { NavItem } from './nav-item';

import AuthProvider from '../services/auth-provider';

import UXAccess from '../utils/ux-access';


export const DashboardSidebar = (props) => {
  const { open, onClose } = props;
  const router = useRouter();
  const [role, setRole] = useState(localStorage.getItem("role"))
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

  const handleLgout = (e,href) => {
    console.log(href)
    if(href==='/login'){
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
              }}/>
              
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
            icon={(<ChartHistBarIcon  fontSize="large"/>)}
            href="/"
            title='Tableau de Bordss'
          />
          { UXAccess.hasProductAccess() && <NavItem
            key='Articles'
            icon={(<CopyIcon fontSize="large" />)}
            href="/products/list-product"
            title="Articles"
          />}
          <NavItem
            key='Logistique'
            icon={(<TrucksIcon fontSize="large" />)}
            href="/provision"
            title='Logistique'
          />
          {UXAccess.hasCategoryAccess() && <NavItem
            key='Groupes'
            icon={(<CopyIcon fontSize="large" />)}
            href="/provision/list-provision"
            title='Groupes'
          />}
          <NavItem
            key='Se Deconnecter'
            icon={(<LogoutIcon fontSize="large" />)}
            href="/login"
            title='Se Deconnecter'
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
            width: 280
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
          width: 280
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
