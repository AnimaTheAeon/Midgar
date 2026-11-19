import { useEffect, useState } from 'react';

// Midgar: phone-sized screens (600 px wide or less). Rows that are wide
// tables on a computer draw themselves as cards here instead.
export const PHONE_QUERY = '(max-width: 600px)';

export function isPhone() {
  return window.matchMedia(PHONE_QUERY).matches;
}

export default function useIsPhone() {
  const [phone, setPhone] = useState(isPhone);

  useEffect(() => {
    const query = window.matchMedia(PHONE_QUERY);
    const onChange = () => setPhone(query.matches);

    query.addEventListener('change', onChange);
    onChange();

    return () => query.removeEventListener('change', onChange);
  }, []);

  return phone;
}
