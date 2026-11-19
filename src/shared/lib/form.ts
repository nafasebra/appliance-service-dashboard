export function getFormText(form: FormData, name: string): string {
  return String(form.get(name) ?? '').trim();
}
