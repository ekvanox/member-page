import
{
  Button,
  Stack,
  TextField,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import PageHeader from '~/components/PageHeader';
import genGetProps from '~/functions/genGetServerSideProps';
import handleApolloError from '~/functions/handleApolloError';
import { useCreateBookableMutation } from '~/generated/graphql';
import { hasAccess, useApiAccess } from '~/providers/ApiAccessProvider';
import { useSetPageName } from '~/providers/PageNameProvider';
import { useSnackbar } from '~/providers/SnackbarProvider';
import UserContext from '~/providers/UserProvider';
import routes from '~/routes';

export default function EditBookable() {
  useSetPageName('Bookables');
  const { t } = useTranslation();
  const router = useRouter();
  const { loading: userLoading } = useContext(UserContext);
  const apiContext = useApiAccess();
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState<string | undefined>(undefined);
  const { showMessage } = useSnackbar();
  const [createBookable] = useCreateBookableMutation({
    variables: {
      input: {
        name,
        name_en: nameEn,
      },
    },
  });

  if (userLoading) {
    return (
      <PageHeader>Create Bookable</PageHeader>
    );
  }

  if (!hasAccess(apiContext, 'booking_request:bookable:create')) {
    return <PageHeader>{t('no_permission_page')}</PageHeader>;
  }

  return (
    <>
      <PageHeader>Create Bookable</PageHeader>
      <form>
        <Stack spacing={2}>
          <TextField label="Name" placeholder="Rosa gaffel" variant="outlined" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          <TextField label="English name" variant="outlined" value={nameEn} onChange={(e) => setNameEn(e.target.value)} fullWidth />
          <Button
            variant="contained"
            onClick={() => createBookable()
              .then(() => {
                showMessage('Bookable successfully created', 'success');
                router.push(routes.bookables);
              })
              .catch((err) => handleApolloError(err, showMessage, t))}
          >
            Create

          </Button>
        </Stack>
      </form>
    </>
  );
}

export const getStaticProps = genGetProps(['booking']);
