/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#18332b',
    tint: '#1f6b58',
    background: '#f6f4ee',
    foreground: '#18332b',
    card: '#fffdf7',
    cardForeground: '#18332b',
    primary: '#1f6b58',
    primaryAlt: '#2d8369',
    primaryForeground: '#fffdf7',
    primaryForegroundMuted: '#d8ede0',
    secondary: '#e9efe8',
    secondaryForeground: '#285343',
    muted: '#ede8da',
    mutedForeground: '#708078',
    accent: '#f0b86e',
    accentSoft: '#f8ead4',
    accentForeground: '#49351f',
    destructive: '#b94c43',
    destructiveForeground: '#fffdf7',
    border: '#ddd8c8',
    input: '#d8d2c3',
  },
  dark: {
    text: '#f8f4e9',
    tint: '#9bd1b2',
    background: '#17221e',
    foreground: '#f8f4e9',
    card: '#21312a',
    cardForeground: '#f8f4e9',
    primary: '#9bd1b2',
    primaryAlt: '#6ea987',
    primaryForeground: '#17221e',
    primaryForegroundMuted: '#d6ebdc',
    secondary: '#294137',
    secondaryForeground: '#e0f0e1',
    muted: '#2b3b33',
    mutedForeground: '#abc0b2',
    accent: '#eeb46b',
    accentSoft: '#4b3d2c',
    accentForeground: '#402d1e',
    destructive: '#f18c80',
    destructiveForeground: '#17221e',
    border: '#395146',
    input: '#446154',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 8,
};

export default colors;
