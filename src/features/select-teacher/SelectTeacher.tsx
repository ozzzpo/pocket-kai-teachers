import React from 'react';
import { useGroup, useSchedule, useTeachers } from '@/entities';
import { Teacher } from '@/shared';
import { useColor, getShortTeacherName } from '@/shared/lib';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuOptionGroup,
  MenuDivider,
  Button,
} from '@chakra-ui/react';

export function SelectTeacher({ onOpen }: { onOpen: () => void }) {
  const { mainElementColor } = useColor();
  const { favouriteGroups } = useGroup();
  const { currentTeacher, favouriteTeachers, setCurrentTeacher } =
    useTeachers();
  const { resetScheduleState } = useSchedule();
  const handleGroupClick = (teacher: Teacher) => {
    setCurrentTeacher(teacher);
    resetScheduleState();
  };
  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton
            className="data-tour-3"
            data-tour="3"
            w={isOpen ? '51%' : '50%'}
            as={Button}
            transition="all 0.2s"
            rightIcon={<ChevronDownIcon />}
            bg={mainElementColor}
            color={'#ffffff'}
            _hover={{ bg: mainElementColor, boxShadow: 'outline' }}
            _focus={{ bg: mainElementColor }}
            fontWeight={'500'}
            fontSize={'14px'}
          >
            {currentTeacher
              ? getShortTeacherName(currentTeacher.name)
              : 'Препод'}
          </MenuButton>
          <MenuList
            className="select-group"
            color={'#ffffff'}
            bg={mainElementColor}
            zIndex={2}
          >
            <MenuItem
              onClick={onOpen}
              color={'#ffffff'}
              bg={mainElementColor}
              fontWeight={'400'}
              fontSize={'16px'}
              justifyContent={'center'}
            >
              Добавить препода
            </MenuItem>
            {favouriteGroups.length > 0 && (
              <React.Fragment>
                <MenuDivider />
                <MenuOptionGroup
                  title="Группа"
                  type="radio"
                  color={'#ffffff'}
                  bg={mainElementColor}
                  fontWeight={'500'}
                  fontSize={'16px'}
                  value={currentTeacher?.id}
                >
                  {favouriteTeachers.map((teacher) => (
                    <MenuItemOption
                      key={teacher.id}
                      value={teacher.id}
                      bg={mainElementColor}
                      onClick={() => handleGroupClick(teacher)}
                    >
                      {teacher.name}
                    </MenuItemOption>
                  ))}
                </MenuOptionGroup>
              </React.Fragment>
            )}
          </MenuList>
        </>
      )}
    </Menu>
  );
}
