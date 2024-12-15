import { Box, Button, Icon, Text } from '@chakra-ui/react';
import { CircleX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ErrorBoundary() {
  const navigate = useNavigate();
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent={'center'}
      minH={'80vh'}
      gap={4}
    >
      <Icon as={CircleX} w={'50px'} h={'50px'} color={'red.500'} />
      <Box>
        <Text fontSize={'24px'} textAlign={'center'}>
          Упс...
        </Text>
        <Text fontSize={'20px'} textAlign={'center'}>
          Кажется, что-то пошло не так.
        </Text>
      </Box>
      <Button onClick={() => navigate('/')}>Вернуться</Button>
    </Box>
  );
}
