import * as React from "react"
import Svg, { Path, G, Defs, ClipPath } from "react-native-svg"
const Pending = (props: any) => (
  <Svg
    width={18}
    height={18}
    fill="none"
    {...props}
  >
    <G
      stroke="#0093D0"
      strokeLinecap="round"
      strokeWidth={2}
      clipPath="url(#a)"
    >
      <Path d="M4.315 4.315A7.333 7.333 0 1 0 9.5 2.167M9.5 9.5 4.75 4.75M9.5 2.375v1.583M16.625 9.5h-1.583M9.5 15.042v1.583M3.958 9.5H2.375" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h18v18H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default Pending