import React, { useState } from 'react';
import { Button, Chip, TextField, Box } from '@mui/material';
import Autocomplete from '@mui/lab/Autocomplete';
import * as RestAccess from '../../../utils/RestAccess';

function TagInput({ onAdd, suggestions }) {
  const [inputValue, setInputValue] = useState('')

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleAddTag = (tag) => {
    if (tag) {
      onAdd(tag);
      setInputValue('');
    }
  };

  const getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0 ? [] : suggestions.filter(item =>
      item.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  return (
    <Box display="flex" alignItems="center">
      <Autocomplete
        freeSolo
        options={getSuggestions(inputValue)}
        value={inputValue}
        onChange={(event, newValue) => handleAddTag(newValue)}
        onInputChange={handleInputChange}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            size="small"
            placeholder="タグ名を入力"
            style={{ marginRight: 8, width: '220px' }}
          />
        )}
      />
      <Button onClick={() => handleAddTag(inputValue)} variant="contained" color="primary">
        追加
      </Button>
    </Box>
  );
}

function TagsDisplay({ tags, onRemove }) {
  return (
    <Box >
      {tags.map((tag, index) => (
        <Chip
          key={index}
          label={tag}
          onDelete={() => onRemove(tag)}
          color="primary"
          style={{ margin: 4 }}
        />
      ))}
    </Box>
  );
}

export default function TagManager({ callBack, tagSet = [] }) {
  const [ tags, setTags ] = useState(tagSet);
  const [ suggestions, setSuggestions ] = useState([]);

  React.useEffect(() => {
    const getTags = async () => {
      const response = await RestAccess.get('/tags');
      if(response.status === 200) {
        const tagSuggestions = response.data.map((tag) => tag.tag_name);
        setSuggestions(tagSuggestions);
      }
    }
    getTags();
  }, [])

  const handleAddTag = (tag) => {
    if (tags.indexOf(tag) === -1) {
      const newTags = [...tags, tag];
      callBack(newTags);
      setTags(newTags);
      // setTags([...tags, tag]);
    }
  };
  const handleRemoveTag = (tagToRemove) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    callBack(newTags);
    setTags(newTags);
  };

  return (
    <div>
      <TagInput onAdd={handleAddTag} suggestions={suggestions} />
      <TagsDisplay tags={tags} onRemove={handleRemoveTag} />
    </div>
  );
}
