import {
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Box,
  Heading,
  Stack,
  Button,
  Divider,
  RadioGroup,
  Radio,
  IconButton,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';
import { useSchedule, useTeachers } from '@/entities';
import { SelectItem, Teacher } from '@/shared';
import { useColor } from '@/shared/lib';
type IFormInput = {
  teacher: SelectItem<Teacher>;
  addToFavourite: boolean;
};

const customStyles: StylesConfig = {
  option: (provided) => ({
    ...provided,
    color: '#000',
  }),
};

export function AddTeacherToFavourite(onClose: () => void) {
  const {
    searchedTeachers,
    favouriteTeachers,
    currentTeacher,
    setCurrentTeacher,
    getTeacherByLogin,
    suggestTeacherByName,
    addTeacherToFavourite,
    removeTeacherFromFavourite,
  } = useTeachers();
  const { mainTextColor, tabColor } = useColor();
  const { resetScheduleState } = useSchedule();
  const { resetField, handleSubmit, control, getValues } =
    useForm<IFormInput>();
  const formRef = useRef<HTMLFormElement>(null);
  const [selectTeacher, setSelectTeacher] = useState<string | undefined>(
    currentTeacher?.name
  );
  const handleInputChange = (newValue: string) => {
    suggestTeacherByName(newValue);
  };
  useEffect(() => {
    setSelectTeacher(currentTeacher?.name);
  }, [currentTeacher]);

  const handleAddToFavouriteClick = () => {
    const selectedTeacher = getValues('teacher');
    if (selectedTeacher) {
      addTeacherToFavourite(selectedTeacher.value);
    }
  };
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const teacherValue = data.teacher;
    const teacher = teacherValue?.value;
    if (teacher) {
      setCurrentTeacher(teacher);
      resetField('teacher');
    }
    if (!teacher && selectTeacher) {
      const teacherByLogin = getTeacherByLogin(selectTeacher);
      setCurrentTeacher(await teacherByLogin);
    }
    resetScheduleState();
    onClose();
  };

  const handleRadioGroupChange = (nextValue: string) => {
    setSelectTeacher(nextValue);
    const teacher = favouriteTeachers.find(
      (teacher) => teacher.name === nextValue
    );
    if (teacher) {
      setCurrentTeacher(teacher);
      resetScheduleState();
      onClose();
      resetField('teacher');
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
      <ModalHeader fontSize={'24px'} fontWeight={'600'} color={mainTextColor}>
        Выбор преподавателя
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody display="flex" flexDirection="column" gap="20px">
        <Controller
          name="teacher"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              placeholder="Введите группу"
              onInputChange={handleInputChange}
              noOptionsMessage={() => 'Ничего не найдено'}
              options={searchedTeachers.map((teacher) => ({
                label: teacher.name,
                value: teacher,
              }))}
              styles={customStyles}
            />
          )}
        />

        <Box w="100%" display="flex" flexWrap={'wrap'} gap="20px">
          <Button
            w="100%"
            bg={tabColor}
            display={getValues('teacher') ? 'block' : 'none'}
            color={mainTextColor}
            onClick={handleAddToFavouriteClick}
          >
            Добавить в избранное
          </Button>
          <Box w="100%" display={'flex'} justifyContent="space-between">
            <Button
              isDisabled={!getValues('teacher')}
              w="48%"
              colorScheme="blue"
              type="submit"
            >
              Выбрать
            </Button>
            <Button
              w="48%"
              colorScheme="blue"
              variant="outline"
              onClick={onClose}
            >
              Назад
            </Button>
          </Box>
        </Box>
        <Box>
          <Heading
            display={favouriteTeachers.length > 0 ? 'block' : 'none'}
            fontSize={'20px'}
            fontWeight={'600'}
            color={mainTextColor}
          >
            Избранные преподаватели
          </Heading>
          <RadioGroup
            value={selectTeacher}
            py="10px"
            onChange={handleRadioGroupChange}
          >
            <Stack fontSize={'18px'} fontWeight={'500'} color={mainTextColor}>
              {favouriteTeachers.map((teacher) => (
                <React.Fragment key={teacher.id}>
                  <Radio
                    key={teacher.id}
                    value={teacher.name}
                    py={'5px'}
                    w={'100%'}
                  >
                    <Box
                      display={'flex'}
                      justifyContent={'space-between'}
                      alignItems={'center'}
                      w={'100%'}
                    >
                      <Text fontSize={'20px'} fontWeight={'normal'}>
                        {teacher.name}
                      </Text>
                      <IconButton
                        aria-label="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTeacherFromFavourite(teacher);
                        }}
                        icon={<DeleteIcon />}
                      />
                    </Box>
                  </Radio>
                  <Divider />
                </React.Fragment>
              ))}
            </Stack>
          </RadioGroup>
        </Box>
      </ModalBody>
    </form>
  );
}
