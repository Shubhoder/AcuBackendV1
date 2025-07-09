import * as React from "react";
import { View } from "react-native";
import Svg, { Defs, RadialGradient, Stop, Path } from "react-native-svg";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
const SVGComponent = ( ) => (
  // <Svg
  //   width="15px"
  //   height="15px"
  //   viewBox="0 0 100 100"
  //   xmlns="http://www.w3.org/2000/svg"
  //   {...props}
  // >
  //   <Defs>
  //     <RadialGradient id="RG1" cx="50%" cy="50%" fx="50%" fy="50%" r="50%">
  //       <Stop
  //         style={{
  //           stopColor: "#0093D0",
  //           stopOpacity: 1,
  //         }}
  //         offset="0%"
  //       />
  //       <Stop
  //         style={{
  //           stopColor: "#0093D0",
  //           stopOpacity: 1,
  //         }}
  //         offset="100%"
  //       />
  //     </RadialGradient>
  //   </Defs>
  //   <Path
  //     style={{
  //       fill: "url(#RG1)",
  //       stroke: "#0093D0",
  //       strokeWidth: 6,
  //     }}
  //     d="m 13,20 0,60 36,-30 z m 43,0 0,60 36,-30 z"
  //   />
  // </Svg>
  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <MaterialIcons name="forward-10" size={35}  color="#0093D086" />
</View>
);
export default SVGComponent;
