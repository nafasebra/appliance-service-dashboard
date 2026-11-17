import { createRootRoute, Link } from '@tanstack/react-router';
import { DashboardLayout } from '@/app/dashboard-layout';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { useTranslation } from 'react-i18next'

export const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

function RootLayout() {
  return <DashboardLayout />;
}

function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <Card className="mx-auto mt-20 w-full max-w-xl">
      <CardHeader>
        <CardTitle className="text-2xl">{t('key270', 'صفحه پیدا نشد')}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-6 text-muted-foreground">{t('key271', 'آدرس واردشده در این برنامه وجود ندارد.')}</p>
        <Button asChild>
          <Link to="/">{t('key272', 'بازگشت به صفحهٔ اصلی')}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
