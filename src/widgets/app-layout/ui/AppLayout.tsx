import { Text, Box, useDisclosure, VStack } from '@chakra-ui/react';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { UiDatebar } from '@/shared/ui/ui-datebar/UiDatebar';
import { DatebarContent } from '../datebar/DatebarContent';
import styles from './AppLayout.module.scss';
import { UiModal } from '@/shared/ui/ui-modal/UiModal';
import { AddTeacherToFavourite } from '@/features';
import { SelectTeacher } from '@/features';
import { useSchedule, useTeachers } from '@/entities';
import { useScrollSpy } from '../lib/useScrollSpy';
import { parityTypes } from '@/shared/constants';
import { scrollToToday, useColor } from '@/shared/lib';
import logo from '../../../shared/assets/images/logo.png';
export type ContextType = [
  string,
  React.Dispatch<React.SetStateAction<string>>
];

export function AppLayout() {
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const [currentDay, setCurrentDay] = useState<string>(
    DateTime.now().setZone('Europe/Moscow').toFormat('yyyy-LL-dd')
  );
  const { currentTeacher } = useTeachers();
  const {
    schedule,
    parity,
    fullScheduleStatus,
    getSchedule,
    getFullScheduleByTeacherId,
    getWeekParity,
  } = useSchedule();
  const swiperRef = useScrollSpy(schedule, setCurrentDay);
  const location = useLocation();
  useEffect(() => {
    const weekAgo = DateTime.now()
      .setZone('Europe/Moscow')
      .startOf('week')
      .minus({ days: 7 })
      .toFormat('yyyy-LL-dd');
    const days_count = 21;

    if (currentTeacher && fullScheduleStatus === 'idle') {
      getFullScheduleByTeacherId(currentTeacher.id).then(() => {
        getSchedule({
          date_from: weekAgo,
          days_count,
        }).then(() => {
          scrollToToday(false);
        });
      });
    }
  }, [
    currentTeacher,
    fullScheduleStatus,
    getSchedule,
    getWeekParity,
    getFullScheduleByTeacherId,
  ]);

  useEffect(() => {
    document.getElementById(currentDay)?.scrollIntoView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);
  const { mainTextColor, mainColor, themeColor } = useColor();
  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      if (isOpen) {
        metaThemeColor.setAttribute('content', themeColor);
      } else {
        metaThemeColor.setAttribute('content', mainColor);
      }
    }
  }, [themeColor, mainColor, isOpen]);
  const isNotDatebar =
    location.pathname.includes('teachers') ||
    location.pathname.includes('schedule/full') ||
    location.pathname.includes('schedule/exams');
  return (
    <Box
      className={styles['app-layout']}
      data-tour="1"
      scrollPaddingTop={
        location.pathname.includes('schedule/full') ? '240px' : '150px'
      }
    >
      <Box
        className=""
        bgColor={mainColor}
        pos={'fixed'}
        boxShadow={{ base: 'none', md: `0px 5px 5px 5px ${mainColor}` }}
        display={'flex'}
        flexDir={'column'}
        gap={{ base: 0, md: 1 }}
        top={0}
        left={0}
        w={'100%'}
        zIndex={20}
      >
        <Box
          px={5}
          py={1}
          className={styles['app-layout__header']}
          bgColor={mainColor}
        >
          <Box display={{ base: 'none', md: 'block' }} w={12}>
            <img src={logo} />
          </Box>
          <Box
            w={{ base: '100%', md: '40%' }}
            display={'flex'}
            alignItems={'center'}
            justifyContent={{ base: 'space-between', md: 'flex-end' }}
            gap={4}
          >
            <VStack
              data-tour="2"
              alignItems={'flex-start'}
              fontWeight={'medium'}
              color={mainTextColor}
              gap={0.4}
              onClick={() => {
                scrollToToday(true);
              }}
            >
              <Text fontSize={'clamp(20px, 5vw, 24px)'}>
                {DateTime.now().setLocale('ru').toFormat('d MMMM')}
              </Text>

              <Text fontSize={'clamp(14px, 4vw, 20px)'}>
                {parity && parityTypes[parity?.parity]}
              </Text>
            </VStack>
            <SelectTeacher onOpen={onOpen} />
          </Box>
        </Box>
        <UiDatebar
          isNotDatebar={isNotDatebar}
          datebarContent={DatebarContent({
            currentDay,
            setCurrentDay,
            swiperRef,
          })}
        />
      </Box>
      <div className="pt-16">
        <Outlet context={[currentDay, setCurrentDay] satisfies ContextType} />
      </div>
      <UiModal
        isOpen={isOpen}
        onClose={onClose}
        setIsOpen={onToggle}
        modalActions={() => AddTeacherToFavourite(onClose)}
      />
    </Box>
  );
}
