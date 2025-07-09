// import React from "react";
// import Svg, { Path, Defs, G, ClipPath, Circle } from "react-native-svg";

// const Logout = (props: { fill?: string }) => (
//   <Svg
//     xmlns="http://www.w3.org/2000/svg"
//     width={18}
//     height={18}
//     fill="none"
//     {...props}
//   >
//     <G
//       stroke={props.fill || "#0093D0"} // Use the fill prop or default to "#0093D0"
//       strokeLinecap="round"
//       strokeWidth={2}
//       clipPath="url(#a)"
//     >
//       <Path d="M6 6h6M6 12h6M10.5 15l3-3-3-3" />
//       <Path d="M6 15V3" />
//     </G>
//     <Defs>
//       <ClipPath id="a">
//         <Path fill="#fff" d="M0 0h18v18H0z" />
//       </ClipPath>
//     </Defs>
//   </Svg>
// );

// export default Logout;

import React from "react";
import Svg, { Path } from "react-native-svg";

const Logout = (props: { fill?: string }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    {...props}
  >
    <Path
      d="M6 3v12M6 9h9M12 6l3 3-3 3"
      stroke={props.fill || "#0093D0"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default Logout;
