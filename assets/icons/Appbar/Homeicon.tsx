import * as React from "react";
import Svg, { Path } from "react-native-svg";

const Homeicon = (props: { fill?: string }) => (
  <Svg
    width={14}
    height={17}
    fill="none"
    {...props}
  >
    <Path
      fill={props.fill || "#0093D0"} // Use the fill prop or default to "#0093D0"
      fillRule="evenodd"
      d="M.274 5.175C0 5.772 0 6.451 0 7.808v4.24c0 1.886 0 2.83.586 3.415.531.532 1.357.58 2.914.585v-5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v5c1.557-.004 2.383-.053 2.914-.585.586-.586.586-1.529.586-3.414v-4.24c0-1.358 0-2.037-.274-2.634-.275-.597-.79-1.039-1.821-1.922l-1-.857C9.04.799 8.11 0 7 0 5.89 0 4.959.799 3.095 2.396l-1 .857C1.065 4.136.55 4.578.275 5.175ZM8.5 16.049v-5h-3v5h3Z"
      clipRule="evenodd"
    />
  </Svg>
);

export default Homeicon;

