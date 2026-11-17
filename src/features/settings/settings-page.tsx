import { useState, type FormEvent } from 'react';
import { Building2, Save } from 'lucide-react';
import { useCompanySettings } from '@/shared/store/settings-store';
import { defaultCompanySettings, type CompanySettings } from '@/entities/company/model/settings';
import { useTheme } from '@/shared/store/theme-store';
import { PageHeading } from '@/shared/ui/primitives';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Label } from '@/shared/ui/label';
import { TimePicker } from '@/shared/ui/date-time-picker';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/shared/ui/alert-dialog';

export function SettingsPage() {
  const settings = useCompanySettings((state) => state.settings);
  const saveSettings = useCompanySettings((state) => state.saveSettings);
  const theme = useTheme((state) => state.theme);
  const toggleTheme = useTheme((state) => state.toggleTheme);
  const [draft, setDraft] = useState<CompanySettings>(() => ({ ...settings }));
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const dirty = Object.keys(draft).some(
    (key) => draft[key as keyof CompanySettings] !== settings[key as keyof CompanySettings],
  );

  function update<K extends keyof CompanySettings>(key: K, value: CompanySettings[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaved(false);
    setError('');
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = {
      ...draft,
      companyName: draft.companyName.trim(),
      brandName: draft.brandName.trim(),
      branchName: draft.branchName.trim(),
      phone: draft.phone.trim(),
      address: draft.address.trim(),
    };
    const failure = saveSettings(next);
    setError(failure ?? '');
    setSaved(!failure);
    if (!failure) setDraft(next);
  }

  return (
    <>
      <PageHeading
        title="تنظیمات"
        description="مشخصات شرکت، پیش‌فرض‌های سفارش و ظاهر داشبورد را مدیریت کنید."
      />
      <form onSubmit={submit} className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="size-5" />
              مشخصات شرکت و شعبه
            </CardTitle>
            <CardDescription>
              نام شرکت در منوی کناری و فوتر و نام شعبه در هدر نمایش داده می‌شود.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="company-name">نام شرکت</Label>
              <Input
                id="company-name"
                value={draft.companyName}
                onChange={(event) => update('companyName', event.target.value)}
                required
                maxLength={60}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="brand-name">نام لاتین برند</Label>
              <Input
                id="brand-name"
                dir="ltr"
                value={draft.brandName}
                onChange={(event) => update('brandName', event.target.value)}
                required
                maxLength={40}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="branch-name">نام شعبه</Label>
              <Input
                id="branch-name"
                value={draft.branchName}
                onChange={(event) => update('branchName', event.target.value)}
                required
                maxLength={60}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="company-phone">شماره تماس شرکت</Label>
              <Input
                id="company-phone"
                type="tel"
                dir="ltr"
                value={draft.phone}
                onChange={(event) => update('phone', event.target.value)}
                maxLength={30}
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="company-address">نشانی شرکت</Label>
              <Textarea
                id="company-address"
                value={draft.address}
                onChange={(event) => update('address', event.target.value)}
                maxLength={300}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>پیش‌فرض‌های ثبت سفارش</CardTitle>
            <CardDescription>
              این مقادیر فقط روی سفارش‌های جدید اعمال می‌شوند و در فرم سفارش قابل تغییرند.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="default-time">ساعت پیش‌فرض مراجعه</Label>
              <TimePicker
                id="default-time"
                value={draft.defaultVisitTime}
                onChange={(event) => update('defaultVisitTime', event.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="default-priority">اولویت پیش‌فرض</Label>
              <Select
                dir="rtl"
                value={draft.defaultPriority}
                onValueChange={(value) => {
                  if (value === 'normal' || value === 'urgent') update('defaultPriority', value);
                }}
              >
                <SelectTrigger id="default-priority" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="normal">عادی</SelectItem>
                    <SelectItem value="urgent">فوری</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              کمیسیون شرکت در هر سفارش به‌صورت مبلغ ثبت می‌شود؛ تغییر پیش‌فرض‌ها مبالغ و تسویه‌های
              قبلی را تغییر نمی‌دهد.
            </p>
          </CardFooter>
        </Card>
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        {saved ? (
          <Alert>
            <AlertDescription>تنظیمات ذخیره شد.</AlertDescription>
          </Alert>
        ) : null}
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={!dirty}>
            <Save className="size-4" />
            ذخیره تغییرات
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!dirty}
            onClick={() => {
              setDraft({ ...settings });
              setError('');
              setSaved(false);
            }}
          >
            لغو تغییرات
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="ghost">
                بازیابی پیش‌فرض‌ها
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent dir="rtl">
              <AlertDialogHeader>
                <AlertDialogTitle>بازیابی تنظیمات پیش‌فرض؟</AlertDialogTitle>
                <AlertDialogDescription>
                  مقادیر فرم به پیش‌فرض برمی‌گردند. برای اعمال، ذخیره تغییرات را بزنید. سفارش‌ها و
                  اطلاعات مالی حذف نمی‌شوند.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>انصراف</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    setDraft({ ...defaultCompanySettings });
                    setSaved(false);
                    setError('');
                  }}
                >
                  بازیابی فرم
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {dirty ? (
            <span className="text-sm text-muted-foreground">تغییرات ذخیره‌نشده دارید.</span>
          ) : null}
        </div>
      </form>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>ظاهر برنامه</CardTitle>
          <CardDescription>
            انتخاب پوسته فوراً اعمال و برای همین مرورگر ذخیره می‌شود.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="settings-theme">پوسته</Label>
          <Select
            dir="rtl"
            value={theme}
            onValueChange={(value) => {
              if (value !== theme) toggleTheme();
            }}
          >
            <SelectTrigger id="settings-theme" className="mt-2 w-full sm:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="light">روشن</SelectItem>
                <SelectItem value="dark">تاریک</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <p className="mt-4 text-xs text-muted-foreground">
        تنظیمات این نسخه در مرورگر فعلی نگهداری می‌شوند.
      </p>
    </>
  );
}
