import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Autocomplete from '@mui/material/Autocomplete';
import { useTranslation } from 'next-i18next';
import { Avatar, Stack, Typography } from '@mui/material';
import routes from '~/routes';
import { MemberHit } from '~/types/MemberHit';

function borderColor(theme): string {
  return theme.palette.mode === 'light'
    ? `1px solid ${theme.palette.common.black}`
    : '';
}

const Search = styled('div')(({ theme }) => ({
  border: borderColor(theme),
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
    [theme.breakpoints.up('md')]: {
      minWidth: '24ch',
    },
    [theme.breakpoints.up('lg')]: {
      width: '100%',
      minWidth: '18ch',
    },
  },
}));

export default function SearchInput({ onSelect, fullWidth } :
{ onSelect: (student_id: string, id: string) => void, fullWidth?: boolean }) {
  const { t } = useTranslation('common');
  const [options, setOptions] = useState<readonly MemberHit[]>([]);
  const [member, setMember] = useState<MemberHit>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const searchUrl = typeof window !== 'undefined' ? `${routes.searchApi}` : '';

  async function onSearch(query: string) {
    if (query.length > 0) {
      const res = await fetch(`${searchUrl}?q=${query}`);
      const data = await res.json();
      setOptions(data.hits);
    } else {
      setOptions([]);
    }
  }

  return (
    <Autocomplete
      id="user-search"
      fullWidth={fullWidth}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option: MemberHit) =>
        (typeof option === 'object'
          ? `${option?.first_name} ${option?.last_name} (${option?.student_id})`
          : option)}
      renderOption={(props, option) => (
        <li
          {...props}
          style={{
            padding: '0.5rem',
            display: 'flex',
            flexDirection: 'row',
            gap: '1rem',
          }}
          key={option.id}
        >
          <Avatar src={option.picture_path} style={{ width: 36, height: 36 }} />
          <Stack>
            <Typography>
              {option?.first_name}
              {option?.nickname ? ` "${option?.nickname}" ` : ' '}
              {option?.last_name}
            </Typography>
            <Typography>
              (
              {option?.student_id}
              )
            </Typography>
          </Stack>
        </li>
      )}
      options={options}
      value={member}
      filterOptions={(x) => x}
      freeSolo
      autoHighlight
      includeInputInList
      noOptionsText={t('no_results')}
      onFocus={() => setIsExpanded(true)}
      onBlur={() => setIsExpanded(false)}
      onChange={(event: any, memberHit: MemberHit | null, reason) => {
        if (memberHit) {
          if (reason === 'selectOption') {
            onSelect(memberHit.student_id, memberHit.id);
          }
          setOptions(memberHit ? [memberHit, ...options] : options);
          setMember(memberHit);
        }
      }}
      onInputChange={(event, newInputValue) => {
        setMember(null);
        onSearch(newInputValue);
      }}
      renderInput={(params) => (
        <Search ref={params.InputProps.ref}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            sx={fullWidth ? undefined : {
              maxWidth: {
                xs: isExpanded ? 300 : 40,
                sm: 300,
                md: isExpanded ? 300 : 40,
                lg: 300,
              },
              overflow: 'hidden',
              transition: 'max-width 0.4s ease-out  ',
            }}
            inputProps={params.inputProps}
            placeholder={t('search_for_members')}
          />
        </Search>
      )}
      renderGroup={(params) => params}
    />
  );
}
