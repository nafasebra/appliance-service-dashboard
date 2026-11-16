import { createRootRoute, Link } from '@tanstack/react-router';
import { DashboardLayout } from '@/app/dashboard-layout';
import { DemoProvider } from '@/features/operations/model/demo-store';

export const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

function RootLayout() {
  return (
    <DemoProvider>
      <DashboardLayout />
    </DemoProvider>
  );
}

function NotFoundPage() {
  return (
    <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold">صفحه پیدا نشد</h1>
      <p className="mt-4 leading-8 text-slate-600">آدرس واردشده در این برنامه وجود ندارد.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-lg text-teal-700 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
      >
        بازگشت به صفحهٔ اصلی
      </Link>
    </section>
  );
}
