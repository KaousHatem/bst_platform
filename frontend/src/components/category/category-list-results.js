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
  Backdrop,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { getInitials } from '../../utils/get-initials';

import {ThreeDots as ThreeDotsIcon} from '../../icons/three-dots'
import {Edit as EditIcon} from '../../icons/edit'
import {Delete as DeleteIcon} from '../../icons/delete'
import {View as ViewIcon} from '../../icons/view'

import CategoryProvider from '../../services/category-provider'

import {CategoryDeleteDialog} from './category-delete-dialog'

export const CategoryListResults = ({ category_list, ...rest}) => {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const [categories, setCategories] = useState(category_list)
  const router = useRouter();

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [categoryIdDelete, setCategoryIdDelete] = useState(-1)

  const [errorSBOpen, setErrorSBOpen] = useState(false)

  const [loadingOpen, setLoadingOpen] = useState(false)
  const [errorSBText, setErrorSBText] = useState("")

  const CANNOT_DELETE_ERROR = "Cette categorie ne peux pas etre supprimer."
  const CONNECTION_ERROR = "Probleme de connexion, Veuillez de ressayer"


  const handleClose = () => {
    setDeleteOpen(false)
  }
  const handleDeleteOpen = (event, category_id) => {
    setCategoryIdDelete(category_id)
    setDeleteOpen(true)
  }

  const handleDeleteCategory = () => {
    setDeleteOpen(false)
    setLoadingOpen(true)
    CategoryProvider.deleteCategory(categoryIdDelete).then(
      (response) => {
        setCategories(categories.filter(function(category) {
          return category.id !== categoryIdDelete
        }))
        setLoadingOpen(false)
      },
      error => {
        setLoadingOpen(false)
        handleSBOpen(CANNOT_DELETE_ERROR)
      }
    )
  }

  const handleSelectAll = (event) => {
    let newSelectedCategoryIds;

    if (event.target.checked) {
      newSelectedCategoryIds = categories.map((category) => category.id);
    } else {
      newSelectedCategoryIds = [];
    }

    setSelectedCategoryIds(newSelectedCategoryIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCategoryIds.indexOf(id);
    let newSelectedCategoryIds = [];

    if (selectedIndex === -1) {
      newSelectedCategoryIds = newSelectedCategoryIds.concat(selectedCategoryIds, id);
    } else if (selectedIndex === 0) {
      newSelectedCategoryIds = newSelectedCategoryIds.concat(selectedCategoryIds.slice(1));
    } else if (selectedIndex === selectedCategoryIds.length - 1) {
      newSelectedCategoryIds = newSelectedCategoryIds.concat(selectedCategoryIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCategoryIds = newSelectedCategoryIds.concat(
        selectedCategoryIds.slice(0, selectedIndex),
        selectedCategoryIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCategoryIds(newSelectedCategoryIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleClickEdit = (e,category) => {

    const data = {
     pathname: '/category/edit-category/',
     query:{'id':category.id}
    }
    router.push(data);
  }

  const handleSBClose = () => {
    setErrorSBOpen(false)
  }

  const handleSBOpen = (text) => {
    setErrorSBText(text)
    setErrorSBOpen(true)
  }





  return(
    <Box {...rest}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingOpen}
        onClick={()=>{setLoadingOpen(false)}}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <PerfectScrollbar>
        <Box sx={{minWidth: "100%"}} >
          <Table>
            <TableHead sx={{
              backgroundColor: '#F4F7FC',
              textAlign: 'center'
            }} >
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCategoryIds.length === categories.length}
                    color="primary"
                    indeterminate={
                      selectedCategoryIds.length > 0
                      && selectedCategoryIds.length < categories.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  Reference
                </TableCell>
                <TableCell>
                  Nom du categorie
                </TableCell>
                <TableCell align="center">
                  <ThreeDotsIcon />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.slice(page*limit, page*limit+limit).map((category)=>(
                <TableRow
                  hover
                  key={category.id}
                  selected={selectedCategoryIds.indexOf(category.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCategoryIds.indexOf(category.id) !== -1}
                      onChange={(event) => handleSelectOne(event, category.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    {category.ref}
                  </TableCell>
                  <TableCell>
                    {category.name}
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
                        onClick = {(event) => {handleClickEdit(event, category)}}
                       />
                        
                       <DeleteIcon 
                        sx={{
                          mx:1
                        }}
                        onClick = {(event) => {handleDeleteOpen(event, category.id)}}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && 
                <TableRow>
                  <TableCell colSpan={7}
                  align="center" >
                    Aucun site existe
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>  
      <TablePagination
        component="div"
        count={categories.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <CategoryDeleteDialog open={deleteOpen} 
      handleDeleteOpen={handleDeleteOpen} 
      handleClose={handleClose}
      handleDeleteCategory={handleDeleteCategory} />
      <Snackbar open={errorSBOpen} 
      onClose={handleSBClose}>
        <Alert variant="filled" 
        severity="error">
          {errorSBText}
        </Alert>
      </Snackbar>
    </Box>


  );
};

CategoryListResults.propTypes = {
  category_list: PropTypes.array.isRequired
};












