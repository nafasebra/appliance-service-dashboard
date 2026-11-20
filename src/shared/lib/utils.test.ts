import test from 'node:test';
import assert from 'node:assert/strict';
import { cn } from './utils';

test('typography roles survive shadcn color overrides in either class order', () => {
  for (const role of ['caption', 'body', 'section', 'page-title', 'metric', 'editable']) {
    const size = `text-${role}`;
    assert.equal(cn(size, 'text-muted-foreground'), `${size} text-muted-foreground`);
    assert.equal(cn('text-primary', size), `text-primary ${size}`);
  }
});

test('typography overrides replace sizes while preserving colors and responsive scopes', () => {
  assert.equal(cn('text-section text-primary', 'text-body'), 'text-primary text-body');
  assert.equal(cn('text-sm', 'text-body'), 'text-body');
  assert.equal(cn('text-body', 'text-sm'), 'text-sm');
  assert.equal(
    cn('text-editable md:text-section text-foreground', 'md:text-body'),
    'text-editable text-foreground md:text-body',
  );
});
