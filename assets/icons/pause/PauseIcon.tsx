import * as React from 'react';
import Svg, {Rect} from 'react-native-svg';
const PauseIconComponent = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}>
    <Rect
      width={3.843}
      height={13.452}
      x={6.099}
      y={5.702}
      stroke="#ffffff"
      strokeLinecap="round"
      strokeWidth={1.922}
      rx={0.961}
    />
    <Rect
      width={3.843}
      height={13.452}
      x={13.786}
      y={5.702}
      stroke="#ffffff"
      strokeLinecap="round"
      strokeWidth={1.922}
      rx={0.961}
    />
  </Svg>
);
export default PauseIconComponent;
