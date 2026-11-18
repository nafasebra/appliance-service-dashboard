import type { ParseKeys } from 'i18next';

// Compatibility labels stay with their message owner; stored records are unchanged.
export const appLabelKeys = {
  'درخواست جدید {{appliance}}': 'notifications.newApplianceRequest',
  '{{companyName}} · مدیریت هوشمند خدمات': 'footer.companynameSmartServiceManagement',
  'رفتن به محتوای اصلی': 'accessibility.skipToMainContent',
  'صفحه پیدا نشد': 'notFound.pageNotFound',
  'آدرس واردشده در این برنامه وجود ندارد.': 'notFound.thisAddressDoesNotExistInTheApplication',
  'بازگشت به صفحهٔ اصلی': 'notFound.backToHome',
  'فعال‌کردن پوسته روشن': 'appearance.switchToLightTheme',
  'فعال‌کردن پوسته تاریک': 'appearance.switchToDarkTheme',
  'پوسته روشن': 'appearance.lightTheme',
  'پوسته تاریک': 'appearance.darkTheme',
  'مشاهده اعلان‌ها': 'notifications.viewNotifications',
  اعلان‌ها: 'notifications.notifications',
  'آخرین درخواست‌های نیازمند بررسی': 'notifications.latestRequestsRequiringAttention',
  'اعلان جدیدی ندارید.': 'notifications.noNewNotifications',
  'نسخه نمایشی · داده‌ها نمونه‌اند و در همین مرورگر ذخیره می‌شوند.':
    'guide.demoVersionSampleDataIsStoredInThis',
  'یک قدم جلوتر از کارها': 'guide.stayOneStepAhead',
  'راهنمای استفاده از نسخه نمایشی': 'guide.howToUseTheDemo',
  'راهنمای داشبورد': 'guide.dashboardGuide',
  'بازنشانی داده‌های نمونه': 'reset.resetSampleData',
  'بازنشانی اطلاعات نمونه؟': 'reset.resetSampleRecords',
  'درخواست‌ها و تراکنش‌هایی که در این مرورگر اضافه یا ویرایش کرده‌اید با داده‌های اولیه جایگزین می‌شوند.':
    'reset.requestsAndTransactionsAddedOrEditedInThis',
  'بازنشانی داده‌ها': 'reset.resetData',
  داشبورد: 'navigation.dashboard',
  'طراحی‌شده برای یک تیم هماهنگ‌تر': 'footer.builtForABetterCoordinatedTeam',
  'راهنمای نسخه نمایشی': 'guide.demoGuide',
  'از «درخواست جدید» یک خدمت برای مشتریان نمونه ثبت کنید. با بازکردن ردیف درخواست، تعمیرکار، زمان مراجعه و وضعیت را تغییر دهید.':
    'guide.createAServiceRequestForASampleCustomer',
  'در صفحه اعزام، تاریخ روز را انتخاب کنید تا برنامه تعمیرکاران نمایش داده شود. دریافت از مشتری، هزینه و تسویه تعمیرکار در امور مالی ثبت می‌شود.':
    'guide.chooseADateOnTheDispatchPageTo',
  'این نسخه بک‌اند ندارد. اطلاعات فقط در همین مرورگر ذخیره می‌شوند. تومان، وضعیت‌ها و جریان پرداخت، انتخاب‌های موقت برای نمایش‌اند.':
    'guide.thisDemoHasNoBackendDataStaysIn',
  'مدیریت کسب‌وکار': 'navigation.businessManagement',
  'حسابداری و امور مالی': 'navigation.accountingAndFinance',
  سیستم: 'navigation.system',
} as const satisfies Readonly<Record<string, ParseKeys<'app'>>>;
