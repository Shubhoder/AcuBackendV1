import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const TrashIconComponent = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={13}
    height={13}
    fill="none"
    {...props}>
    <Path
      stroke="#E41E2F"
      strokeLinecap="round"
      strokeWidth={1.051}
      d="M5.255 8.022V6.445M7.357 8.022V6.445M1.576 3.817h9.46v0c-.49 0-.735 0-.928.08a1.051 1.051 0 0 0-.569.57c-.08.193-.08.437-.08.927v3.154c0 .99 0 1.486-.308 1.794-.308.308-.803.308-1.794.308H5.255c-.991 0-1.487 0-1.795-.308-.308-.308-.308-.803-.308-1.794V5.394c0-.49 0-.734-.08-.928a1.051 1.051 0 0 0-.569-.568c-.193-.08-.438-.08-.927-.08v0ZM5.29 1.91c.06-.056.192-.105.376-.14.183-.036.408-.055.64-.055.231 0 .456.02.64.055.183.035.315.084.375.14"
    />
  </Svg>
);
export default TrashIconComponent;
