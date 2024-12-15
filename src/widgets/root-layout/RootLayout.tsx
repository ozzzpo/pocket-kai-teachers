import { UiNavbar } from '@/shared/ui/ui-navbar/ui-navbar';
import { Outlet } from 'react-router-dom';
import {
  Box,
  useChakra,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { NavbarActions } from './navbar/NavbarActions';
import { PWABadge, useUser } from '@/entities';
export function RootLayout() {
  const { theme } = useChakra();
  const themeColor = useColorModeValue(
    theme.colors.light.main,
    theme.colors.dark.main
  );
  const { colorMode } = useColorMode();

  const { userAuthStatus, backgroundTasks, getBackgroundTaskStatus } =
    useUser();

  useEffect(() => {
    if (!backgroundTasks) return;
    const getStatuses = () => {
      backgroundTasks.map((task) => {
        if (task.status !== 'SUCCESS' && task.status !== 'FAILED') {
          getBackgroundTaskStatus(task.id, task.name);
        }
      });
    };
    const isSomeNotEnded = backgroundTasks.some(
      (task) =>
        task.status === 'PENDING' ||
        task.status === 'STARTED' ||
        task.status === 'IDLE'
    );
    //eslint-disable-next-line
    let intervalId: any;
    if (userAuthStatus === 'success' && isSomeNotEnded) {
      intervalId = setInterval(() => {
        getStatuses();
      }, 2000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [backgroundTasks, userAuthStatus, getBackgroundTaskStatus]);

  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeColor);
    }
  }, [themeColor, colorMode]);

  return (
    <Box minH={'100%'}>
      <Outlet />
      <UiNavbar navbarActions={NavbarActions} />
      <PWABadge />
    </Box>
  );
}
