import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, Button, ListItem, IconButton,MenuItem } from '@mui/material';

export const SubNavItem = (props) => {
  const { href, title, ...others } = props;
  const router = useRouter();
  const active = href ? (router.pathname === href) : false;

  return (
    <NextLink href={href}
      passHref>
      <MenuItem sx={{'&:hover': {
        backgroundColor: 'rgba(255,255,255, 0.08)'
        }}} >{title}</MenuItem>
    </NextLink>
  );
};


