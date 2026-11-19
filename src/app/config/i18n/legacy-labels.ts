import type { ParseKeys } from 'i18next';

// Compatibility labels stay with their message owner; stored records are unchanged.
export const dashboardLabelKeys = {
  'درخواست جدید {{appliance}}': 'notifications.newApplianceRequest',
  'رفتن به محتوای اصلی': 'accessibility.skipToMainContent',
  'صفحه پیدا نشد': 'notFound.pageNotFound',
  'آدرس واردشده در این برنامه وجود ندارد.': 'notFound.thisAddressDoesNotExistInTheApplication',
  'بازگشت به صفحهٔ اصلی': 'notFound.backToHome',
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
} as const satisfies Readonly<Record<string, ParseKeys<'dashboard'>>>;
