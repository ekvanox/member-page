import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

export default makeStyles((theme: Theme) => ({
  sidebar: {
    [theme.breakpoints.up('md')]: {
      marginTop: '76px',
      borderRadius: '10px',
      padding: 0,
    },
  },
  sidebarGrid: {
    [theme.breakpoints.up('md')]: {
      position: 'sticky',
      top: '-76px',
    },
  },
}));
