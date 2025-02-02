import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

const LoadingAnimation = ({ height }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height={height}
      data-cy="loading"
    >
      <CircularProgress />
    </Box>
  );
};
const Loading = ({ height = '100%', fullScreen = false }) => {
  return fullScreen ? (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      zIndex={9999}
    >
      <LoadingAnimation height={height} />
    </Box>
  ) : (
    <LoadingAnimation height={height} />
  );
};

export default Loading;
