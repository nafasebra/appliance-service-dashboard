import { createRootRoute, Link } from '@tanstack/react-router';
import { DashboardLayout } from '@/app/dashboard-layout';
import { DemoProvider } from '@/entities/service/model/demo-store';
import { PartsProvider } from '@/features/parts/model/parts-store';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

function RootLayout() {
  return (
    <DemoProvider>
      <PartsProvider>
        <DashboardLayout />
      </PartsProvider>
    </DemoProvider>
  );
}

function NotFoundPage() {
  return (
    <Card className="mx-auto mt-20 w-full max-w-xl">
      <CardHeader>
        <CardTitle className="text-2xl">صفحه پیدا نشد</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-6 text-muted-foreground">آدرس واردشده در این برنامه وجود ندارد.</p>
        <Button asChild>
          <Link to="/">بازگشت به صفحهٔ اصلی</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
