import { Box, Text, Divider } from '@chakra-ui/react';

import { FadedLessonCard, LessonCard, RestCard, useSchedule } from '@/entities';
import { TopBoundary, BottomBoundary, DayNameWithShare } from '@/features';

import { useInfiniteScroll, useGoUpButton } from '@/shared/lib';
import { getTodayDate } from '@/shared';
import { ArrowIcon } from '@/shared/assets';
import { scrollToToday, useColor } from '@/shared/lib';
import { Loader } from '@/shared/ui/loader/Loader';
import styles from './ScheduleLayout.module.scss';
import { DateTime } from 'luxon';
export function ScheduleLayout() {
  const today = getTodayDate();
  const { schedule, fullScheduleStatus } = useSchedule();
  const { upperRef, lowerRef } = useInfiniteScroll();
  const { showButton, position: todayBlockPosition } = useGoUpButton();
  const { mainElementColor } = useColor();

  return (
    <Loader status={fullScheduleStatus} idleMessage="Выберите группу">
      <Box
        id="schedule"
        className={styles['schedule']}
        alignItems={{ base: '', md: 'flex-start' }}
        w={{ base: '100%', md: 'fit-content' }}
        margin={{ base: '0', md: '0 auto' }}
      >
        <TopBoundary ref={upperRef} />
        {schedule?.map((day) => {
          const isFirstDayOfWeek = DateTime.fromISO(day.date).weekday === 1;
          const weekParity =
            DateTime.fromISO(day.date).weekNumber % 2 === 0
              ? 'Чётная неделя'
              : 'Нечётная неделя';
          return (
            <Box key={day.date} id={day.date} className={styles['day']}>
              {isFirstDayOfWeek && (
                <Box
                  w={'100%'}
                  display="flex"
                  flexDir="column"
                  color={'gray.400'}
                  fontWeight="medium"
                  fontSize="16px"
                  pt="5px"
                  lineHeight="100%"
                  gap="10px"
                >
                  <Divider />
                  <Text>{weekParity}</Text>
                </Box>
              )}
              <DayNameWithShare day={day} />
              <div className={styles['day__timeline']}>
                <div className={styles['day__timeline-stub']} />
                <div className={styles['day__timeline-part']}>
                  <Box
                    bgColor={today >= day.date ? '#3182ce80' : '#3182ce'}
                    className={styles['day__timeline-part-line']}
                  />
                </div>
              </div>
              {day.lessons.length === 0 ? (
                <RestCard dayDate={day.date} /> // Выводим RestCard, если нет нескрытых занятий
              ) : (
                day.lessons.map((lesson) => {
                  return lesson.parsed_dates &&
                    !lesson.parsed_dates.includes(day.date) ? (
                    <FadedLessonCard
                      key={lesson.id}
                      lesson={lesson}
                      dayDate={day.date}
                    />
                  ) : (
                    <LessonCard
                      lesson={lesson}
                      dayDate={day.date}
                      key={lesson.id}
                    />
                  );
                })
              )}
            </Box>
          );
        })}
        <BottomBoundary ref={lowerRef} />

        {!!showButton && (
          <Box
            onClick={() => scrollToToday(true)}
            as="button"
            w="50px"
            h="50px"
            borderRadius="8px"
            position="fixed"
            bottom="80px"
            right="5%"
            bgColor={mainElementColor}
            zIndex={'10'}
          >
            {todayBlockPosition === 'above' ? (
              <ArrowIcon color="white" w={'20px'} h={'20px'} />
            ) : (
              <ArrowIcon
                color="white"
                w={'20px'}
                h={'20px'}
                transform="rotate(180deg)"
              />
            )}
          </Box>
        )}
      </Box>
    </Loader>
  );
}
