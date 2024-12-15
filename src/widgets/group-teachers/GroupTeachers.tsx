import { useGroup } from '@/entities';
import { Box, Text } from '@chakra-ui/react';
import { TeacherCard } from '@/entities';
import { useEffect } from 'react';
import { Loader } from '@/shared/ui/loader/Loader';
import { useColor } from '@/shared/lib';
export function GroupTeachers() {
  const { mainTextColor } = useColor();
  const {
    currentGroup,
    groupDisciplines,
    groupDisciplinesStatus,
    getGroupDisciplines,
  } = useGroup();
  useEffect(() => {
    if (currentGroup && groupDisciplinesStatus === 'idle') {
      getGroupDisciplines(currentGroup.id);
    }
  }, [currentGroup, groupDisciplinesStatus, getGroupDisciplines]);
  return (
    <Loader status={groupDisciplinesStatus} idleMessage="Выберите группу">
      <Box id="teacher">
        <Box pt="20px" display="flex" flexDirection="column" gap="10px">
          {groupDisciplines &&
            groupDisciplines.map((discipline) => {
              const uniqueTeachers = new Map();
              discipline.types.forEach((disciplineType) => {
                if (!uniqueTeachers.has(disciplineType.teacher?.id)) {
                  uniqueTeachers.set(disciplineType.teacher?.id, {
                    teacher: disciplineType.teacher,
                    parsed_types: [disciplineType.parsed_type],
                    original_types: [disciplineType.original_type],
                    disciplineName: discipline.name,
                    disciplineId: [discipline.id],
                  });
                } else {
                  const existingTeacher = uniqueTeachers.get(
                    disciplineType.teacher?.id
                  );
                  existingTeacher.parsed_types.push(disciplineType.parsed_type);
                  existingTeacher.original_types.push(
                    disciplineType.original_type
                  );
                  existingTeacher.disciplineId.push(discipline.id);
                }
              });
              return (
                <Box key={discipline.id}>
                  <Text
                    color={mainTextColor}
                    fontWeight="bold"
                    fontSize="16px"
                    noOfLines={2}
                  >
                    {discipline.name}
                  </Text>
                  {Array.from(uniqueTeachers.values()).map(
                    (uniqueDisciplineType, index) => (
                      <TeacherCard
                        disciplineType={{
                          teacher: uniqueDisciplineType.teacher,
                          parsed_types: uniqueDisciplineType.parsed_types,
                          original_types: uniqueDisciplineType.original_types,
                        }}
                        disciplineName={uniqueDisciplineType.disciplineName}
                        disciplineId={uniqueDisciplineType.disciplineId}
                        key={index}
                      />
                    )
                  )}
                </Box>
              );
            })}
        </Box>
      </Box>
    </Loader>
  );
}
