import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';

const ResumeIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    viewBox="0 0 40 40"
    fill="none"
    {...props}>
    {/* Vertical line */}
    <Rect
      x={13}
      y={12}
      width={4}
      height={16}
      rx={1}
      stroke="#ffffff"
      strokeWidth={2}
    />

    {/* Play triangle */}
    <Path
      d="M20 12L28 20L20 28V12Z"
      stroke="#ffffff"
      strokeWidth={2}
      strokeLinejoin="round"
    />
  </Svg>
);

export default ResumeIcon;
