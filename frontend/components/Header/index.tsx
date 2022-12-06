import React, { PropsWithChildren } from 'react';
import {
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useRouter } from 'next/router';
import routes from '~/routes';
import SearchInput from './SearchInput';
import DarkModeSelector from './components/DarkModeSelector';
import LanguageSelector from './components/LanguageSelector';
import AuthenticationStatus from './AuthenticationStatus';
import navigationItems from '../Navigation/Menu';
import NavigationItem from './NavigationItem';

function Layout({ children }: PropsWithChildren<{}>) {
  const theme = useTheme();
  const hideSmall = useMediaQuery(theme.breakpoints.up('sm'));
  const router = useRouter();
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {hideSmall && (
        <SearchInput
          onSelect={(studentId) => {
            router.push(routes.member(studentId));
          }}
        />
      )}
      <LanguageSelector />
      <DarkModeSelector />
      {children}
    </Stack>
  );
}

function Header() {
  // const classes = useHeaderStyles();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      paddingTop={2}
      paddingBottom={2}
      spacing={2}
      margin="0 -0.5rem"
    >
      <Stack direction="row" spacing={2} width="100%">
        {navigationItems.map((item) => (
          <NavigationItem item={item} key={item.translationKey} />
        ))}
      </Stack>
      <Layout>
        <AuthenticationStatus />
      </Layout>
    </Stack>
  );
}

export default Header;
