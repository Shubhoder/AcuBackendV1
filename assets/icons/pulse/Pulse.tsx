import * as React from "react"
import Svg, { Rect } from "react-native-svg"
const PulseComponent = (props:any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={47}
    height={34}
    fill="none"
    {...props}
  >
    <Rect width={2} height={24} x={4} y={5} fill="#F57C21" rx={1} />
    <Rect width={2} height={24} x={40} y={5} fill="#F57C21" rx={1} />
    <Rect width={2} height={24} x={22} y={5} fill="#F57C21" rx={1} />
    <Rect width={2} height={24} x={13} y={5} fill="#F57C21" rx={1} />
    <Rect width={2} height={34} x={31} fill="#F57C21" rx={1} />
    <Rect width={2} height={12} y={11} fill="#F57C21" rx={1} />
    <Rect width={2} height={12} x={36} y={11} fill="#F57C21" rx={1} />
    <Rect width={2} height={12} x={18} y={11} fill="#F57C21" rx={1} />
    <Rect width={2} height={12} x={9} y={11} fill="#F57C21" rx={1} />
    <Rect width={2} height={12} x={45} y={11} fill="#F57C21" rx={1} />
    <Rect width={2} height={12} x={27} y={11} fill="#F57C21" rx={1} />
  </Svg>
)
export default PulseComponent
