export const getShortTeacherName = (name: string) => {
  const teacherNameArr = name.split(' ');
  const teacherName = teacherNameArr?.length
    ? teacherNameArr.length === 3
      ? `${teacherNameArr[0]} ${teacherNameArr[1].charAt(
          0
        )}.${teacherNameArr[2].charAt(0)}.`
      : teacherNameArr.join(' ')
    : 'Преподаватель кафедры';
  return teacherName;
};
