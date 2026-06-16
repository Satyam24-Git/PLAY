import { useWindowDimensions } from 'react-native';

const MOBILE_BREAKPOINT = 640;

export function useResponsive() {
  const { width } = useWindowDimensions();
  const isMobile = width < MOBILE_BREAKPOINT;
  return { isMobile, width };
}
