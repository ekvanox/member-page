import
{
  Grid,
  Paper,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import BigCalendar from '~/components/Calendar/BigCalendar';
import createPageTitle from '~/functions/createPageTitle';
import genGetProps from '~/functions/genGetServerSideProps';

export default function CalendarPage() {
  const { t } = useTranslation('common');

  return (
    <Grid
      container
      spacing={3}
      direction="row"
      justifyContent="center"
      alignItems="flex-start"
    >
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <h2>{t('calendar')}</h2>
        <Head>
          <title>{createPageTitle(t, 'calendar')}</title>
        </Head>
        <Paper style={{ padding: '0.5rem' }}>
          <BigCalendar />
        </Paper>
      </Grid>
    </Grid>
  );
}

export const getStaticProps = genGetProps([
  'event',
  'booking',
  'calendar',
]);
