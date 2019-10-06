import { useTheme, useMediaQuery } from '@material-ui/core';

export default function useScreenSize() {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  return {
    isSmallScreen: isSmDown,
    isLargeScreen: !isSmDown
  };
}
