import React, { useEffect } from 'react';
import LoginProvider from '../providers/LoginProvider';
import ThemeProvider from '../providers/ThemeProvider';
import { appWithTranslation } from 'next-i18next';
import { AppProps } from 'next/app';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { UserProvider } from '~/providers/UserProvider';
import { ApiAccessProvider } from '~/providers/ApiAccessProvider';
import '~/styles/react-big-calendar.css';
import { MeilisearchProvider } from '~/providers/MeilisearchProvider';
import Layout from '~/components/layout';

function MyApp({ Component, pageProps, cookies }: AppProps & { cookies: any }) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <LoginProvider cookies={cookies}>
        <ThemeProvider>
          <UserProvider>
            <ApiAccessProvider>
              <MeilisearchProvider>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </MeilisearchProvider>
            </ApiAccessProvider>
          </UserProvider>
        </ThemeProvider>
      </LoginProvider>
    </>
  );
}

export default appWithTranslation(MyApp);

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'header', 'member'])),
  },
});
