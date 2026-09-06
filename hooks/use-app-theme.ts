import { Colors } from '@/constants/theme';

/** HandiShare is dark-mode-first: this is the single source of truth for themed colors. */
export function useAppColors() {
  return Colors.dark;
}
