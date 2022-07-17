import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon, Typography
} from '@mui/material';
import { Search as SearchIcon } from '../../icons/search';
import { Upload as UploadIcon } from '../../icons/upload';
import { Download as DownloadIcon } from '../../icons/download';
import { Positive as PositiveIcon } from '../../icons/positive';

export const ProductAddToolbar = (props) => (
  <Box>
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
        Article
      </Typography>
      <Box sx={{ m: 1 }}>
        
        <Button
          color="primary"
          variant="outlined"
          href = '/products'
          sx={{ mr: 4 }}
        >
          Annuler
        </Button>
        <Button
          color="primary"
          variant="contained"
          form="add-product-form"
          type = "submit"
          startIcon={(<PositiveIcon />)}
          sx={{ mr: 1 }}
        >
          Confirmer
        </Button>
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
  </Box>
);
