import { HStack, useChakra, useColorModeValue } from '@chakra-ui/react';
import { ReactNode } from 'react';
import styles from './ui-navbar.module.scss';

export function UiNavbar({
  navbarActions,
}: {
  navbarActions: () => ReactNode;
}) {
  const { theme } = useChakra();
  const mainElement = useColorModeValue(
    theme.colors.light.main_element,
    theme.colors.dark.main_element
  );
  const mainColor = useColorModeValue(
    theme.colors.light.main,
    theme.colors.dark.main
  );
  return (
    <HStack
      pos={'fixed'}
      bottom={'15px'}
      w={{ base: '90%', md: 'auto' }}
      py={1}
      px={{ base: 2, md: 7 }}
      bgColor={mainElement}
      className={styles['navbar']}
      boxShadow={{ base: `0px 15px 20px 30px ${mainColor}`, md: 'none' }}
      justifyContent={{ base: 'space-around', md: 'space-between' }}
    >
      {navbarActions()}
    </HStack>
  );
}
