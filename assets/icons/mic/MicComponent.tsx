import * as React from "react"
import Svg, { Path } from "react-native-svg"
const MicComponent = (props:any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill="#333"
      d="M15.84 10.625 9.563 7.486A1.73 1.73 0 0 0 7.06 9.033v5.934a1.73 1.73 0 0 0 2.503 1.547l6.277-3.139c1.133-.566 1.133-2.184 0-2.75Z"
    />
  </Svg>
)
export default MicComponent