import { Box, withStyles } from '@material-ui/core';

import { hexToRgb } from '../styles/styles';

const MobileMenu = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.common.black,
    color: 'rgba(' + hexToRgb(theme.palette.common.white) + ', 0.8)',
  },
}))(Box);

export default MobileMenu;
