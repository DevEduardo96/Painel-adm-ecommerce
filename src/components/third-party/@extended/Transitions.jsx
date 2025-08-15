
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

// material-ui
import { Collapse, Fade, Grow, Slide, Zoom } from '@mui/material';

// ==============================|| TRANSITIONS ||============================== //

const Transitions = forwardRef(({ children, type = 'grow', direction = 'up', ...others }, ref) => {
  let component;

  switch (type) {
    case 'grow':
      component = <Grow ref={ref} {...others}>{children}</Grow>;
      break;
    case 'collapse':
      component = <Collapse ref={ref} {...others}>{children}</Collapse>;
      break;
    case 'fade':
      component = <Fade ref={ref} {...others}>{children}</Fade>;
      break;
    case 'slide':
      component = <Slide ref={ref} direction={direction} {...others}>{children}</Slide>;
      break;
    case 'zoom':
      component = <Zoom ref={ref} {...others}>{children}</Zoom>;
      break;
    default:
      component = <Grow ref={ref} {...others}>{children}</Grow>;
  }

  return component;
});

Transitions.propTypes = {
  children: PropTypes.node,
  type: PropTypes.oneOf(['grow', 'collapse', 'fade', 'slide', 'zoom']),
  direction: PropTypes.oneOf(['up', 'down', 'left', 'right'])
};

Transitions.displayName = 'Transitions';

export default Transitions;
