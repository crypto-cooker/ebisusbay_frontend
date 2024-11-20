export const breakpoints = {
  xxs: 370,
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1080,
  xxl: 1440,
};

// export const mediaQueries = {
//   xxs: ``,
//   xs: `@media screen and (min-width: ${breakpoints.xs}px)`,
//   sm: `@media screen and (min-width: ${breakpoints.sm}px)`,
//   md: `@media screen and (min-width: ${breakpoints.md}px)`,
//   lg: `@media screen and (min-width: ${breakpoints.lg}px)`,
//   xl: `@media screen and (min-width: ${breakpoints.xl}px)`,
//   xxl: `@media screen and (min-width: ${breakpoints.xxl}px)`,
// };

export type Breakpoint = keyof typeof breakpoints;

export const breakpointNames = Object.keys(breakpoints) as Breakpoint[];