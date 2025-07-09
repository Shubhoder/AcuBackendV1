import * as React from "react"
import Svg, { Path } from "react-native-svg"
const Recordingicon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={26}
    height={26}
    fill="none"
    {...props}
  >
    <Path
      stroke="#0093D0"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.543}
      d="M13 16.6a4.113 4.113 0 0 0 4.114-4.114V6.829A4.113 4.113 0 0 0 13 2.714 4.113 4.113 0 0 0 8.886 6.83v5.657A4.113 4.113 0 0 0 13 16.6Z"
    />
    <Path
      stroke="#0093D0"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.543}
      d="M5.131 10.583v1.748C5.131 16.672 8.66 20.2 13 20.2c4.34 0 7.868-3.528 7.868-7.868v-1.75M11.57 7.27a4.142 4.142 0 0 1 2.86 0M12.177 9.451a3.228 3.228 0 0 1 1.656 0M13 20.2v3.086"
    />
  </Svg>
)
export default Recordingicon
