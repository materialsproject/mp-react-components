import * as React from 'react';
import { useRef, useEffect } from 'react';
import { getSVGNode } from './stuff';

interface MultipleScatterPlotProps {
  /**
   * width and height of the component
   */
  width: number;
  padding: number;
  data: any;
  cardinalColumn: string;
}

export function MultipleScatterPlots({ width, padding, data = false, cardinalColumn }) {
  const mountNode = useRef(null);

  useEffect(() => {
    console.log(mountNode);
    const chart = getSVGNode(data, cardinalColumn, width, padding);
    (mountNode.current! as HTMLElement).appendChild(chart);
  }, []);

  return (
    <>
      <div
        className="scatterplot-container"
        style={{ width: width, height: width }}
        ref={mountNode}
      />
    </>
  );
}
