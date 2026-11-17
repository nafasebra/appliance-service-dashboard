import { createRootRoute, Link } from '@tanstack/react-router';
import { DashboardLayout } from '@/app/dashboard-layout';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { useTranslation } from 'react-i18next';

export const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

function RootLayout() {
  return <DashboardLayout />;
}

function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <Card className="mx-auto mt-20 w-full max-w-xl">
      <CardHeader>
        <CardTitle className="text-2xl">{t('ui.pageNotFound')}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-6 text-muted-foreground">
          {t('ui.thisAddressDoesNotExistInTheApplication')}
        </p>
        <Button asChild>
          <Link to="/">{t('ui.backToHome')}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
