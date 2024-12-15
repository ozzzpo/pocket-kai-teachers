import { BackgroundTaskStatus, FetchStatus } from '@/shared';
import { Box, Spinner } from '@chakra-ui/react';
import React from 'react';

export const Loader = ({
  children,
  status,
  idleMessage,
}: React.PropsWithChildren<{
  status: FetchStatus | BackgroundTaskStatus;
  idleMessage: string;
}>) => {
  switch (status) {
    case 'loading' || 'PENDING' || 'STARTED':
      return (
        <Box
          pos={'absolute'}
          zIndex={2}
          left={0}
          right={0}
          top={'45%'}
          mx={'auto'}
          w={'fit-content'}
          fontSize={'20px'}
        >
          <Spinner size={'xl'} />
        </Box>
      );
    case 'error' || 'FAILED':
      return (
        <Box
          pos={'absolute'}
          zIndex={2}
          left={0}
          right={0}
          top={'45%'}
          mx={'auto'}
          w={'fit-content'}
          fontSize={'20px'}
        >
          Что-то пошло не так...
        </Box>
      );
    case 'idle' || 'IDLE':
      return (
        <Box
          pos={'absolute'}
          zIndex={2}
          left={0}
          right={0}
          top={'45%'}
          mx={'auto'}
          w={'fit-content'}
          fontSize={'20px'}
        >
          {idleMessage}
        </Box>
      );
    case 'success' || 'SUCCESS':
      return children;
  }
};
