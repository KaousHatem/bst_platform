import { useState, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Menu,
  MenuItem
} from '@mui/material';
import { getInitials } from '../../utils/get-initials';

import {ThreeDots as ThreeDotsIcon} from '../../icons/three-dots'
import {Edit as EditIcon} from '../../icons/edit'
import {Delete as DeleteIcon} from '../../icons/delete'
import {View as ViewIcon} from '../../icons/view'
import Label from '../Label';
import LocationProvider from '../../services/location-provider'
import UserProvider from '../../services/user-provider'

import { UserDeleteDialog } from './user-delete-dialog'



export const UserListResults = ({ user_list=[], ...rest }) => {
  
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [locations, setLocations] = useState([])

  const [users, setUsers] = useState(user_list)

  
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  
  const router = useRouter();

  const roles = {
    1: "Administrateur",
    2: "Administrateur Logistique",
    3: "Magasinier"
  }

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [userIdDelete, setUserIdDelete] = useState(-1)
  const [clickedId, setClickedId] = useState(-1)
  const [clickedStatus, setClickedStatus] = useState(false)
  

  const handleClickMenu = (event, user) => {
    setClickedId(user.id)
    setClickedStatus(user.is_active)
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClickOpen = (e, id) => {
    setOpen(true)
    setId(id)
  }


  const handleClose = () => {
    setDeleteOpen(false)
  }
  const handleDeleteOpen = (event, user_id) => {
    setUserIdDelete(user_id)
    setDeleteOpen(true)
  }

  const handleDeleteUser = () => {
    setDeleteOpen(false)
    UserProvider.deleteUser(userIdDelete).then(
      (response) => {
        console.log('user: '+userIdDelete+' is deleted')
        setUsers(users.filter(function(user) {
          return user.id !== userIdDelete
        }))
      },
      error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(resMessage)
      }
    )
  }

  const handleSelectAll = (event) => {
    let newSelectedUserIds;

    if (event.target.checked) {
      newSelectedUserIds = users.map((user) => user.id);
    } else {
      newSelectedUserIds = [];
    }

    setSelectedUserIds(newSelectedUserIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedUserIds.indexOf(id);
    let newSelectedUserIds = [];

    if (selectedIndex === -1) {
      newSelectedUserIds = newSelectedUserIds.concat(selectedUserIds, id);
    } else if (selectedIndex === 0) {
      newSelectedUserIds = newSelectedUserIds.concat(selectedUserIds.slice(1));
    } else if (selectedIndex === selectedUserIds.length - 1) {
      newSelectedUserIds = newSelectedUserIds.concat(selectedUserIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedUserIds = newSelectedUserIds.concat(
        selectedUserIds.slice(0, selectedIndex),
        selectedUserIds.slice(selectedIndex + 1)
      );
    }

    setSelectedUserIds(newSelectedUserIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleClickEdit = (e,user) => {

    const data = {
     pathname: '/user/edit-user',
     query:{'id':user.id}
    }
    router.push(data);
  }

  const handleActivate = (e) => {
    const index = users.findIndex(user => user.id === clickedId)
    const tmpUser = users[index]
    tmpUser.is_active = true
    const data = {
      is_active: true
    }

    UserProvider.activateUser(data,clickedId).then(
      (response) => {
        users[index].is_active = true
        // console.log(users)
        // setUsers(users)
      })
    setAnchorEl(null);
  }

  const handleDeactivate = (e) => {
    const index = users.findIndex(user => user.id === clickedId)
    const tmpUser = users[index]
    tmpUser.is_active = false
    const data = {
      is_active: false
    }
    UserProvider.activateUser(data,clickedId).then(
      (response) => {
        users[index].is_active = false
        // console.log(users)
        // setUsers(users)
      })
    setAnchorEl(null);
  }



  return (
    <Box {...rest}>
      
      <PerfectScrollbar>
        <Box sx={{ minWidth: "100%" }}>
          <Table>
            <TableHead sx={{
              backgroundColor: '#F4F7FC',
              textAlign: 'center'
            }} 
            >
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedUserIds.length === users.length}
                    color="primary"
                    indeterminate={
                      selectedUserIds.length > 0
                      && selectedUserIds.length < users.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  Nom d`&apos;`utilisateur
                </TableCell>
                <TableCell>
                  Role
                </TableCell>
                <TableCell>
                  Site
                </TableCell>
                <TableCell>
                  Temps de Login
                </TableCell>
                <TableCell align="center" >
                  status
                </TableCell>
                <TableCell align="center">
                  <ThreeDotsIcon />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.slice(page*limit, page*limit+limit).map((user) => (
                <TableRow
                  hover
                  key={user.id}
                  selected={selectedUserIds.indexOf(user.id) !== -1}
                  
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedUserIds.indexOf(user.id) !== -1}
                      onChange={(event) => handleSelectOne(event, user.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    {user.username}
                  </TableCell>
                  <TableCell>
                    {roles[user.role]}
                  </TableCell>
                  <TableCell>
                     {user.location}
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.last_login),'yyyy-MM-dd hh:mm')}
                  </TableCell>
                  <TableCell align="center">
                    {user.is_active && "active" || "non active"}
                  </TableCell>
                  <TableCell
                    >
                    <Box
                      align="center"
                      sx={{
                          justifyContent: 'center',
                          display: 'flex'
                      }}
                    >
                    
                      <EditIcon 
                        sx={{
                          mx:1
                        }}
                        onClick = {(event) => {handleClickEdit(event, user)}}
                       />
                        
                       <DeleteIcon 
                        sx={{
                          mx:1
                        }}
                        onClick = {(event) => {handleDeleteOpen(event, user.id)}}
                      />
                      <ThreeDotsIcon 
                        sx={{
                          mx:1
                        }}
                        id="edit-btn"
                        aria-haspopup="true"
                        aria-controls={menuOpen ? 'edit-menu' : undefined}
                        aria-expanded={menuOpen ? 'true' : undefined}
                        onClick={(event) => handleClickMenu(event, user)}
                      />
                      <Menu
                        id="edit-menu"
                        anchorEl={anchorEl}
                        open={menuOpen}
                        onClose={handleCloseMenu}
                        MenuListProps={{
                          'aria-labelledby': 'edit-btn',
                        }}
                      >
                        { clickedStatus && <MenuItem onClick={(event) => handleDeactivate(event)}>Deactiver</MenuItem>
                        || <MenuItem onClick={(event) => handleActivate(event)}>Activer</MenuItem>}
                        
                      </Menu>

                    </Box>
                    
                  </TableCell>
                  
                </TableRow>
              ))}
              {users.length === 0 && 
                    <TableRow>
                      <TableCell colSpan={7} 
                      align="center">
                        Aucun utilisateur existe
                      </TableCell>
                    </TableRow>
                  }
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={users.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <UserDeleteDialog open={deleteOpen} 
      handleDeleteOpen={handleDeleteOpen} 
      handleClose={handleClose} 
      handleDeleteUser={handleDeleteUser} />
    </Box>
  );
};

UserListResults.propTypes = {
  users: PropTypes.array.isRequired
};
