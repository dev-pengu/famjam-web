import { Color } from '@famjam/tokens/base.styles';
import type { MembershipColor } from '@/types/api';

// Maps the backend's named member colors to the matching @famjam/tokens
// palette token (Color.Palette*), shared wherever a member's assigned color
// needs to render (calendar chips/avatars, the color picker itself).
export const MEMBERSHIP_COLOR_TOKEN: Record<MembershipColor, Color> = {
  red: Color.PaletteRed,
  orange: Color.PaletteOrange,
  amber: Color.PaletteAmber,
  yellow: Color.PaletteYellow,
  lime: Color.PaletteLime,
  green: Color.PaletteGreen,
  teal: Color.PaletteTeal,
  cyan: Color.PaletteCyan,
  blue: Color.PaletteBlue,
  indigo: Color.PaletteIndigo,
  violet: Color.PaletteViolet,
  pink: Color.PalettePink,
};
