import {
  Box,
  Icon,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { Calendar, CalendarDays } from 'lucide-react';
import { useSchedule, useSettings, useTeachers } from '@/entities';
import { Day, getFormattedDate, getTodayDate } from '@/shared';
import { shareData, useColor } from '@/shared/lib';
import { getFormattedDaySchedule } from './lib/getFormattedDaySchedule';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/shared/ui/context-menu';
import { getFormattedWeekSchedule } from './lib/getFormattedWeekSchedule';

export function DayNameWithShare({ day }: { day: Day }) {
  const { mainTextColor, mainElementColor } = useColor();

  const isToday = day.date === getTodayDate();
  const dayNameColor = useColorModeValue(
    `${mainElementColor}40`,
    `${mainElementColor}80`
  );
  const toast = useToast();
  const { isColoredDayDate } = useSettings();
  const { schedule } = useSchedule();
  const { currentTeacher } = useTeachers();
  const isDesktop = useBreakpointValue({ base: false, md: true });
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Box
          display={'flex'}
          alignItems={'center'}
          gap={isToday ? 2 : 0}
          bgColor={isColoredDayDate ? dayNameColor : ''}
          _active={{ opacity: 0.5, bgColor: 'gray.200' }}
          transition={'0.2s'}
          borderRadius={3}
          py={0.5}
          px={1.5}
          my={1}
          w={'fit-content'}
          color={`${mainTextColor}e6`}
          fontWeight="medium"
          fontSize="18px"
        >
          <Text fontSize={'18px'}>{isToday && '➤'}</Text>
          <Text fontSize={'clamp(16px, 5vw, 18px)'}>
            {getFormattedDate(day.date)}
          </Text>
        </Box>
      </ContextMenuTrigger>
      <ContextMenuContent avoidCollisions>
        <ContextMenuItem
          className={`space-x-2 ${day.lessons.length ? '' : 'hidden'}`}
          onClick={() =>
            day.lessons.length &&
            shareData(
              getFormattedDaySchedule(day, currentTeacher!),
              toast,
              isDesktop
            )
          }
        >
          <Text>Поделиться днём</Text>
          <Icon as={Calendar} />
        </ContextMenuItem>
        <ContextMenuSeparator
          className={`bg-gray-300 dark:bg-gray-500  ${
            day.lessons.length ? '' : 'hidden'
          }`}
        />
        <ContextMenuItem
          className="space-x-2"
          onClick={() =>
            shareData(
              getFormattedWeekSchedule(day, schedule, currentTeacher!),
              toast,
              isDesktop
            )
          }
        >
          <Text>Поделиться неделей</Text>
          <Icon as={CalendarDays} />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
