import { translateLabel } from '@/shared/i18n';
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
import { useTranslation } from 'react-i18next';

export function SettingsPage() {
  const { t } = useTranslation();
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
        title={t('ui.settings')}
        description={t('ui.manageCompanyDetailsOrderDefaultsAndDashboardAppearance')}
      />
      <form onSubmit={submit} className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="size-5" />
              {t('ui.companyAndBranchDetails')}
            </CardTitle>
            <CardDescription>{t('ui.theCompanyNameAppearsInTheSidebarAnd')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="company-name">{t('ui.companyName')}</Label>
              <Input
                id="company-name"
                value={draft.companyName}
                onChange={(event) => update('companyName', event.target.value)}
                required
                maxLength={60}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="brand-name">{t('ui.latinBrandName')}</Label>
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
              <Label htmlFor="branch-name">{t('ui.branchName')}</Label>
              <Input
                id="branch-name"
                value={draft.branchName}
                onChange={(event) => update('branchName', event.target.value)}
                required
                maxLength={60}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="company-phone">{t('ui.companyPhone')}</Label>
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
              <Label htmlFor="company-address">{t('ui.companyAddress')}</Label>
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
            <CardTitle>{t('ui.newOrderDefaults')}</CardTitle>
            <CardDescription>{t('ui.theseDefaultsApplyOnlyToNewOrdersAnd')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="default-time">{t('ui.defaultVisitTime')}</Label>
              <TimePicker
                id="default-time"
                value={draft.defaultVisitTime}
                onChange={(event) => update('defaultVisitTime', event.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="default-priority">{t('ui.defaultPriority')}</Label>
              <Select
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
                    <SelectItem value="normal">{t('ui.normal')}</SelectItem>
                    <SelectItem value="urgent">{t('ui.urgent')}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              {t('ui.companyCommissionIsRecordedAsAnAmountOn')}
            </p>
          </CardFooter>
        </Card>
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{translateLabel(error)}</AlertDescription>
          </Alert>
        ) : null}
        {saved ? (
          <Alert>
            <AlertDescription>{t('ui.settingsSaved')}</AlertDescription>
          </Alert>
        ) : null}
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={!dirty}>
            <Save className="size-4" />
            {t('ui.saveChanges')}
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
            {t('ui.discardChanges')}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="ghost">
                {t('ui.restoreDefaults')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('ui.restoreDefaultSettings')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('ui.theFormWillReturnToItsDefaultsSelect')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('ui.cancel2')}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    setDraft({ ...defaultCompanySettings });
                    setSaved(false);
                    setError('');
                  }}
                >
                  {t('ui.resetForm')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {dirty ? (
            <span className="text-sm text-muted-foreground">{t('ui.youHaveUnsavedChanges')}</span>
          ) : null}
        </div>
      </form>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t('ui.appearance')}</CardTitle>
          <CardDescription>{t('ui.themeChangesApplyImmediatelyAndAreSavedFor')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="settings-theme">{t('ui.theme')}</Label>
          <Select
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
                <SelectItem value="light">{t('ui.light')}</SelectItem>
                <SelectItem value="dark">{t('ui.dark')}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <p className="mt-4 text-xs text-muted-foreground">
        {t('ui.settingsInThisDemoAreStoredInThe')}
      </p>
    </>
  );
}
