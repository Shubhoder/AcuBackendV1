import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';
const SearchComponent = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={13}
    height={13}
    fill="none"
    {...props}>
    <Circle cx={5.958} cy={5.958} r={3.792} stroke="#333" strokeWidth={1.083} />
    <Path
      stroke="#333"
      strokeLinecap="round"
      strokeWidth={1.083}
      d="M10.833 10.833 9.208 9.208"
    />
  </Svg>
);
export default SearchComponent;
