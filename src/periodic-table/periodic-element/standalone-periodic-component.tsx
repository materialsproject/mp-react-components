import { PeriodicElement, PeriodicElementProps } from "./periodic-element.component";
import * as React from "react";
import './standalone-periodic-element.less';


interface StandalonePeriodicComponentProps extends  PeriodicElementProps {
  /**
   * width and height of the component
   */
  size: number
}

// allow to pass the layout
export function StandalonePeriodicComponent({size, ...remainingProps}: StandalonePeriodicComponentProps) {
  const style = {
    width: size,
    height: size
  };

  return (
    <div className="mp-element-wrapper" style={style}>
    <PeriodicElement {...remainingProps}/>
  </div>)
}
