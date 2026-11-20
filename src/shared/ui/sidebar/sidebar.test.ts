import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Sidebar, SidebarProvider, SidebarTrigger } from './sidebar';
import { getSidebarMode, getSidebarViewport, sidebarMedia } from './sidebar-state';

test('tablet stays icon-only regardless of desktop and mobile preferences', () => {
  for (const open of [false, true]) {
    for (const openMobile of [false, true]) {
      assert.equal(getSidebarMode('tablet', open, openMobile), 'icon');
    }
  }
});

test('desktop and mobile use independent full-mode preferences', () => {
  assert.equal(getSidebarMode('desktop', true, false), 'full');
  assert.equal(getSidebarMode('desktop', false, true), 'icon');
  assert.equal(getSidebarMode('mobile', true, false), 'hidden');
  assert.equal(getSidebarMode('mobile', false, true), 'full');
  assert.equal(getSidebarViewport(true, false), 'mobile');
  assert.equal(getSidebarViewport(false, false), 'tablet');
  assert.equal(getSidebarViewport(false, true), 'desktop');
});

function renderSidebar(mobile: boolean, desktop: boolean, open = true) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      matchMedia: (query: string) => ({
        matches: query === sidebarMedia.mobile ? mobile : desktop,
      }),
    },
  });
  try {
    return renderToStaticMarkup(
      createElement(
        SidebarProvider,
        { defaultOpen: open },
        createElement(Sidebar, { id: 'test-sidebar' }, createElement('a', { href: '/' }, 'Home')),
        createElement(SidebarTrigger, { 'aria-controls': 'test-sidebar' }),
      ),
    );
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'window', descriptor);
    else Reflect.deleteProperty(globalThis, 'window');
  }
}

test('desktop collapse retains a visible icon rail and exposes trigger state', () => {
  const expanded = renderSidebar(false, true);
  assert.match(expanded, /data-mode="full"/);
  assert.match(expanded, /aria-expanded="true"/);
  const collapsed = renderSidebar(false, true, false);
  assert.match(collapsed, /data-mode="icon"/);
  assert.match(collapsed, /aria-expanded="false"/);
  assert.match(collapsed, /sidebar-width-icon/);
});

test('tablet renders the rail without a toggle; mobile starts hidden with a toggle', () => {
  const tablet = renderSidebar(false, false);
  assert.match(tablet, /data-mode="icon"/);
  assert.doesNotMatch(tablet, /data-slot="sidebar-trigger"/);
  const mobile = renderSidebar(true, false);
  assert.doesNotMatch(mobile, /<aside/);
  assert.match(mobile, /data-slot="sidebar-trigger"/);
  assert.match(mobile, /aria-expanded="false"/);
});
