import { render, act, waitFor } from '@testing-library/react';
import { COPY } from '@/content/copy';
import { CalBooking } from '@/components/CalBooking';

const ui = vi.fn();
vi.mock('@calcom/embed-react', () => ({
  default: ({ namespace, calLink, config }: { namespace: string; calLink: string; config: { layout: string; theme: string } }) => <div data-testid="cal" data-namespace={namespace} data-cal-link={calLink} data-layout={config.layout} data-theme={config.theme} />,
  getCalApi: () => Promise.resolve(ui),
}));

let fire: (() => void) | null = null;
beforeEach(() => {
  fire = null;
  (globalThis as any).IntersectionObserver = class { constructor(cb: (e: { isIntersecting: boolean }[]) => void) { fire = () => cb([{ isIntersecting: true }]); } observe() {} unobserve() {} disconnect() {} };
});

it('contact offers two Cal.com bookings: the free intro and the consulting retainer', () => {
  expect(COPY.contact.booking).toEqual([
    { slug: 'observation', calLink: 'scott-campbell/observation', caption: 'Intro, 20 minutes, free' },
    { slug: 'consulting', calLink: 'scott-campbell/consulting', caption: 'Consulting, $300 retainer' },
  ]);
  expect(COPY.contact.links.email).toBe('mailto:ps2pdx@gmail.com');
  expect(COPY.contact.resume.href).toBe('/Scott_Campbell_Resume.pdf');
});

it('each embed mounts lazily in a framed plate with its calLink, month view and the page theme', async () => {
  document.documentElement.setAttribute('data-theme', 'light');
  for (const b of COPY.contact.booking) {
    const { container, unmount } = render(<CalBooking {...b} />);
    expect(container.querySelector('[data-testid="cal"]')).toBeNull();
    expect(container.querySelector('figcaption')!.textContent).toBe(b.caption);
    act(() => fire!());
    await waitFor(() => expect(container.querySelector('[data-testid="cal"]')).not.toBeNull());
    const cal = container.querySelector('[data-testid="cal"]')!;
    expect(cal.getAttribute('data-cal-link')).toBe(b.calLink);
    expect(cal.getAttribute('data-namespace')).toBe(b.slug);
    expect(cal.getAttribute('data-layout')).toBe('month_view');
    expect(cal.getAttribute('data-theme')).toBe('light');
    await waitFor(() => expect(ui).toHaveBeenCalledWith('ui', expect.objectContaining({ theme: 'light', layout: 'month_view' })));
    unmount();
  }
  document.documentElement.removeAttribute('data-theme');
});
