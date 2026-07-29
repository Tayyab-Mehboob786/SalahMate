/**
 * SalahMate Icon Sizing System
 *
 * Standardized semantic size tiers for all icons.
 * Every icon in the application must use one of these sizes.
 */

export const iconSizes = {
  /** 14px — tiny inline indicators, status dots */
  xs: 14,
  /** 16px — small icons for inline text, labels, badges */
  sm: 16,
  /** 20px — medium icons for list items, standard buttons */
  md: 20,
  /** 24px — large icons for app bars, major actions, navigation */
  lg: 24,
  /** 32px — extra large icons for prominent empty states, features, hero areas */
  xl: 32,
} as const;

export type IconSize = keyof typeof iconSizes;

// Legacy export for backward compatibility
export const icons = {
  small: iconSizes.sm,
  medium: iconSizes.md,
  large: iconSizes.lg,
  xl: iconSizes.xl,
} as const;
