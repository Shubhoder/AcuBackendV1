import * as React from "react"
import Svg, { Path } from "react-native-svg"
const Playicon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={40} 
    height={40} 
    viewBox="0 0 40 40"  
    fill="none"
    {...props}
  >
    <Path
      width={39}
      height={39}
      x={0.5}
      y={0.5}
      stroke="#0093D0"
      strokeOpacity={0.4}
      rx={19.5}
    />
    <Path
      stroke="#0093D0"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m24.211 19.106-6.474-3.238A1.2 1.2 0 0 0 16 16.942v6.116a1.2 1.2 0 0 0 1.737 1.074l6.474-3.238a1 1 0 0 0 0-1.788Z"
    />
  </Svg>
);
export default Playicon;
