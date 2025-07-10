import * as React from "react";
import Svg, { Path, Defs, G, ClipPath } from "react-native-svg";

const Changepass = (props: { fill?: string }) => (
  <Svg
    width={18}
    height={18}
    fill="none"
    {...props}
  >
    <G
      stroke={props.fill || "#0093D0"} // Use the fill prop or default to "#0093D0"
      strokeLinecap="round"
      strokeWidth={2}
      clipPath="url(#a)"
    >
      <Path d="M4.5 9V3.75M9 6V3.75M4.5 14.25V12M13.5 14.25v-1.5M9 14.25V9M7.5 6h3M3 12h3M12 12.75h3M13.5 9.75v-6" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h18v18H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default Changepass;




