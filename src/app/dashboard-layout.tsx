import { useState } from 'react';
import { Link, Outlet } from '@tanstack/react-router';
import {
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
  Wrench,
  Users,
  Wallet,
  ChartNoAxesCombined,
  Search,
  ChevronDown,
  Menu,
  X,
  LifeBuoy,
  RotateCcw,
  FlaskConical,
  ArrowUpLeft,
  Moon,
  Sun,
} from 'lucide-react';
import { useDemo } from '@/features/operations/model/demo-store';
import { useTheme } from '@/shared/lib/theme';
import { Modal } from '@/shared/ui/primitives';
import { Button } from '@/components/ui/button';

const navigation = [
  { to: '/', label: 'نمای کلی', icon: LayoutDashboard },
  { to: '/requests', label: 'درخواست‌های خدمات', icon: ClipboardList },
  { to: '/dispatch', label: 'برنامه‌ریزی و اعزام', icon: CalendarDays },
  { to: '/technicians', label: 'تعمیرکاران', icon: Wrench },
  { to: '/customers', label: 'مشتریان', icon: Users },
  { to: '/finance', label: 'امور مالی', icon: Wallet },
  { to: '/reports', label: 'گزارش‌ها', icon: ChartNoAxesCombined },
] as const;

export function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const { jobs, storageError, resetDemo } = useDemo();
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="dashboard-shell">
      <a className="skip-link" href="#main-content">
        رفتن به محتوای اصلی
      </a>
      {mobileOpen && (
        <Button
          variant="ghost"
          aria-label="بستن منو"
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <Link to="/" onClick={() => setMobileOpen(false)}>
            <span className="brand-icon">
              <Wrench size={24} />
            </span>
            <strong>
              همیار سرویس<span>HAMYAR SERVICE</span>
            </strong>
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            type="button"
            className="icon-button mobile-close"
            aria-label="بستن منو"
            onClick={() => setMobileOpen(false)}
          >
            <X size={19} />
          </Button>
        </div>
        <div className="workspace-label">
          پنل مدیریت شرکت<span>نسخه اولیه</span>
        </div>
        <div className="nav-caption">مدیریت کسب‌وکار</div>
        <nav aria-label="منوی اصلی">
          {navigation.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === '/' }}
              activeProps={{ className: 'nav-link nav-active' }}
              inactiveProps={{ className: 'nav-link' }}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={20} strokeWidth={1.7} />
              <span>{label}</span>
              {to === '/requests' && (
                <span className="nav-count">
                  {new Intl.NumberFormat('fa').format(
                    jobs.filter((job) => job.status === 'new').length,
                  )}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <span className="help-icon">
              <LifeBuoy size={23} />
            </span>
            <strong>یک قدم جلوتر از کارها</strong>
            <p>راهنمای استفاده از نسخه نمایشی</p>
            <Button variant="outline" onClick={() => setHelpOpen(true)}>
              راهنمای داشبورد <ArrowUpLeft size={16} />
            </Button>
          </div>
          <Button variant="ghost" className="reset-button" onClick={() => setResetOpen(true)}>
            <RotateCcw size={17} />
            بازنشانی داده‌های نمونه
          </Button>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-start">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="باز کردن منو"
              aria-expanded={mobileOpen}
              className="icon-button mobile-menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={22} />
            </Button>
            <span className="topbar-title">مدیریت یکپارچه خدمات</span>
            <span className="topbar-divider" />
            <span className="workspace-name">
              <i />
              شعبه تهران
            </span>
          </div>
          <div className="topbar-end">
            <Link className="topbar-search" to="/requests">
              <Search size={18} />
              <span>جستجو در درخواست‌ها</span>
            </Link>
            <Button
              variant="outline"
              size="icon-sm"
              className="icon-button theme-toggle"
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'فعال‌کردن پوسته روشن' : 'فعال‌کردن پوسته تاریک'}
              title={theme === 'dark' ? 'پوسته روشن' : 'پوسته تاریک'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            <span className="topbar-divider" />
            <div className="profile">
              <span className="avatar">م</span>
              <div>
                <strong>مدیر مجموعه</strong>
                <small>حساب نمایشی</small>
              </div>
              <ChevronDown size={14} />
            </div>
          </div>
        </header>
        <div className="demo-strip">
          <span>
            <FlaskConical size={14} />
            نسخه نمایشی · داده‌ها نمونه‌اند و در همین مرورگر ذخیره می‌شوند.
          </span>
          <span>دوشنبه، ۲۵ آبان ۱۴۰۵ · تاریخ مرجع نمونه</span>
        </div>
        {storageError && (
          <div className="storage-error" role="alert">
            ذخیره‌سازی مرورگر در دسترس نیست؛ تغییرات پس از بستن صفحه حفظ نمی‌شوند.
          </div>
        )}
        <main id="main-content" className="main-content">
          <Outlet />
        </main>
        <footer className="page-footer">
          <span>همیار سرویس · مدیریت هوشمند خدمات</span>
          <span>طراحی‌شده برای یک تیم هماهنگ‌تر</span>
        </footer>
      </div>
      {helpOpen && (
        <Modal title="راهنمای نسخه نمایشی" onClose={() => setHelpOpen(false)}>
          <div className="help-content">
            <p>
              از «درخواست جدید» یک خدمت برای مشتریان نمونه ثبت کنید. با بازکردن ردیف درخواست،
              تعمیرکار، زمان مراجعه و وضعیت را تغییر دهید.
            </p>
            <p>
              در صفحه اعزام، تاریخ روز را انتخاب کنید تا برنامه تعمیرکاران نمایش داده شود. دریافت از
              مشتری، هزینه و تسویه تعمیرکار در امور مالی ثبت می‌شود.
            </p>
            <p>
              این نسخه بک‌اند ندارد. اطلاعات فقط در همین مرورگر ذخیره می‌شوند. تومان، وضعیت‌ها و
              جریان پرداخت، انتخاب‌های موقت برای نمایش‌اند.
            </p>
          </div>
        </Modal>
      )}
      {resetOpen && (
        <Modal title="بازنشانی اطلاعات نمونه؟" onClose={() => setResetOpen(false)}>
          <div className="help-content">
            <p>
              درخواست‌ها و تراکنش‌هایی که در این مرورگر اضافه یا ویرایش کرده‌اید با داده‌های اولیه
              جایگزین می‌شوند.
            </p>
            <div className="form-actions">
              <Button
                variant="destructive"
                className="button button-danger"
                onClick={() => {
                  resetDemo();
                  setResetOpen(false);
                }}
              >
                بازنشانی داده‌ها
              </Button>
              <Button variant="outline" className="button" onClick={() => setResetOpen(false)}>
                انصراف
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
