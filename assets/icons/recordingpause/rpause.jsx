import * as React from "react"
import Svg, { Path } from "react-native-svg"
import * as React from "react"

const rpause = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
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
      width={4}
      height={14}
      x={14}
      y={13}
      stroke="#0093D0"
      strokeLinecap="round"
      strokeWidth={2}
      rx={1}
    />
    <Path
      width={4}
      height={14}
      x={22}
      y={13}
      stroke="#0093D0"
      strokeLinecap="round"
      strokeWidth={2}
      rx={1}
    />
  </Svg>
)
export default rpause
