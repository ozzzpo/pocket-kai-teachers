import { GroupShort } from '@/shared';
import { useColor } from '@/shared/lib';
import { Avatar, Box, Text } from '@chakra-ui/react';
import { HashLink } from 'react-router-hash-link';

export function DrawerGroupCard({ group }: { group: GroupShort }) {
  const { cardColor, tabTeacher, tabColor, mainElementColor } = useColor();
  return (
    <Box
      as={HashLink}
      // to={
      //   lesson
      //     ? `/teachers#${lesson?.teacher?.id}&${lesson.discipline.id}`
      //     : '/teachers'
      // }
      boxShadow={`0px 0px 5px 0px ${tabColor}`}
      bgColor={cardColor}
      borderRadius="16px"
      padding="14px"
      display="flex"
      alignItems="center"
      gap="15px"
      transition="0.2s"
      _active={{ bgColor: tabTeacher, transition: '0.2s' }}
    >
      <Avatar bg={mainElementColor} />
      <Box>
        <Text fontSize="16px" fontWeight="medium">
          Группа{' '}
          <Text as={'span'} fontWeight={'semibold'}>
            {group.group_name}
          </Text>
        </Text>
        <Text fontSize="12px" fontWeight="medium">
          {group.kai_id}
        </Text>
      </Box>
    </Box>
  );
}
