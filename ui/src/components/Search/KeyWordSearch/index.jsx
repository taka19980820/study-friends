import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const SearchBar = ({ data }) => {
  const [inputValue, setInputValue] = useState('');

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0 ? [] : data.filter(item =>
      item.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  return (
    <Autocomplete
      id="search-box"
      freeSolo
      options={getSuggestions(inputValue)}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => <TextField {...params} size='small' label="キーワードを入力" margin="normal" variant="outlined" />}
    />
  );
};

export default SearchBar;
