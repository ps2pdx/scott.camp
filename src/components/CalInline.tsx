import { useEffect } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';
import type { Theme } from '@/lib/theme';
import s from './CalBooking.module.css';

export default function CalInline({ namespace, calLink, theme }: { namespace: string; calLink: string; theme: Theme }) {
  useEffect(() => {
    let live = true;
    getCalApi({ namespace }).then((cal) => { if (live) cal('ui', { theme, layout: 'month_view', hideEventTypeDetails: false }); });
    return () => { live = false; };
  }, [namespace, theme]);
  return <Cal namespace={namespace} calLink={calLink} className={s.cal} config={{ layout: 'month_view', theme }} />;
}
