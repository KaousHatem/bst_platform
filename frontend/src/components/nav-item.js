import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, Button, ListItem, IconButton } from '@mui/material';

export const NavItem = (props) => {
  const { href, icon, title, ...others } = props;
  const router = useRouter();
  const active = href ? (router.pathname === href) : false;

  return (
    <ListItem
      disableGutters
      sx={{
        display: 'flex',
        mb: 0.5,
        py: 0,
        px: 2
      }}
      {...others}
    >
      {href && <NextLink
        href={href}
        passHref
      >
        <Box
          component="a"
          disableRipple
          sx={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: active && 'rgba(255,255,255, 0.08)',
            borderRadius: 1,
            color: active ? 'secondary.main' : 'neutral.300',
            fontWeight: active && 'fontWeightBold',
            // justifyContent: 'center',
            px: 3,
            // textAlign: 'center',
            textDecoration: 'None',
            textTransform: 'none',
            width: '100%',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255, 0.08)'
            }
          }}
        >
          <IconButton
            sx={{
              '&:hover': {
                background: 'none',
              },
            }}
          >
            {icon}
          </IconButton>

          <Box sx={{
            flexGrow: 1,
            alignSelf: 'center'
          }}>
            {title}
          </Box>
        </Box>
      </NextLink> ||

        <Box
          component="a"
          disableRipple
          sx={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: active && 'rgba(255,255,255, 0.08)',
            borderRadius: 1,
            color: active ? 'secondary.main' : 'neutral.300',
            fontWeight: active && 'fontWeightBold',
            // justifyContent: 'space-between',
            px: 3,
            // textAlign: 'center',
            textDecoration: 'None',
            textTransform: 'none',
            width: '100%',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255, 0.08)'
            }
          }}
        >
          <IconButton
            sx={{
              '&:hover': {
                background: 'none',
              },
            }}
          >
            {icon}
          </IconButton>

          <Box sx={{
            flexGrow: 1,
            alignSelf: 'center'
          }}>
            {title}
          </Box>
        </Box>
      }

    </ListItem>
  );
};

NavItem.propTypes = {
  href: PropTypes.string,
  icon: PropTypes.node,
  title: PropTypes.string
};
