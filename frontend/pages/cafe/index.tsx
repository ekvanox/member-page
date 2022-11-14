import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Markdown from '~/components/Markdown';

export default function CafePage() {
  const { t } = useTranslation();
  return (
    <>
      <h2>{t('cafe')}</h2>
      <Markdown name="cafe" />
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'news'])),
    },
  };
}
