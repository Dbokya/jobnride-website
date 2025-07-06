import React from 'react';
import {
  Paper,
  Stack,
  TextField,
  Button,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  FilterList,
} from '@mui/icons-material';

const SearchBar = ({ searchTerm, onSearchChange, onClear }) => {
  return (
    <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        <TextField
          fullWidth
          placeholder="Search jobs, companies, or locations..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: { sm: 400 } }}
        />
        <Button
          variant="contained"
          color="secondary"
          sx={{ minWidth: 100 }}
          onClick={onClear}
        >
          Clear
        </Button>
      </Stack>
    </Paper>
  );
};

export default SearchBar;