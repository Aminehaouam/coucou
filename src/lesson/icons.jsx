// One icon family: 24px grid, 2px round strokes.
const Svg = ({ children, size = 22 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

export const Back = () => <Svg><path d="M15 5l-7 7 7 7" /></Svg>;
export const Close = () => <Svg><path d="M6 6l12 12M18 6L6 18" /></Svg>;
export const Next = () => <Svg><path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
export const Keyboard = () => <Svg><rect x="2.5" y="6" width="19" height="12" rx="3" /><path d="M7 10h.01M11 10h.01M15 10h.01M17.5 14h-11" /></Svg>;
export const Mic = () => <Svg size={30}><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5.5 11.5a6.5 6.5 0 0013 0M12 18v3" /></Svg>;
export const Speaker = () => <Svg size={20}><path d="M11 5L6.5 9H3v6h3.5L11 19V5z" /><path d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13" /></Svg>;
export const Check = () => <Svg size={14}><path d="M5 12.5l4.5 4.5L19 7.5" /></Svg>;

/** Faceless driver glyph: flat cap and shoulders, no features. */
export const Driver = () => (
  <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true">
    <circle cx="24" cy="24" r="24" fill="#A9B9A1" />
    <path d="M8 44c1-9 7-13 16-13s15 4 16 13a24 24 0 01-32 0z" fill="#202D40" />
    <ellipse cx="24" cy="21" rx="7.5" ry="8.5" fill="#E4C3A3" />
    <path d="M15.5 18.5c0-7 4-10 8.5-10s8.5 3 8.5 10c-2.5-2-5.5-2.6-8.5-2.6s-6 .6-8.5 2.6z" fill="#202D40" />
    <path d="M14 18.8c3.5-1.6 7-2 10-2s6.5.4 10 2l1.4 1.9H12.6z" fill="#2c3b54" />
  </svg>
);
