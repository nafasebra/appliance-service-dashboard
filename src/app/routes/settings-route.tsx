import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './root-route';
import { SettingsPage } from '@/features/settings/settings-page';

export const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});
