/**
 * SalahMate — Authentication & User TypeScript Definitions (`src/types/auth.types.ts`)
 *
 * Core interfaces defining user profiles, preferences, and session models.
 */

export interface UserPreferences {
  calculationMethod: string;
  juristicMethod: 'Standard' | 'Hanafi';
  highLatitudeRule: string;
  notifications: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
}
