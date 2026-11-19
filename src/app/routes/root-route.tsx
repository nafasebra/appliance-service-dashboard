import { useDashboardTranslation } from '../hooks/use-dashboard-translation.tsx';
import { createRootRoute, Link } from '@tanstack/react-router';
import { DashboardLayout } from '../dashboard-layout.tsx';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

function RootLayout() {
  return <DashboardLayout />;
}

function NotFoundPage() {
  const t = useDashboardTranslation();
  return (
    <Card className="mx-auto mt-20 w-full max-w-xl">
      <CardHeader>
        <CardTitle className="text-page-title">{t('notFound.pageNotFound')}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-6 text-muted-foreground">
          {t('notFound.thisAddressDoesNotExistInTheApplication')}
        </p>
        <Button asChild>
          <Link to="/">{t('notFound.backToHome')}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
