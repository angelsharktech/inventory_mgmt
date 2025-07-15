// src/components/shared/SearchBar.jsx
import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const FilterData = ({ value, onChange }) => {
  return (
    <TextField
      label="Search products..."
      variant="outlined"
      size="small"
      value={value}
      onChange={onChange}
      sx={{ mb: 2, width: "300px" }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default FilterData;
