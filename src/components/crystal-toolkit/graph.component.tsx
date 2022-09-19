import React, { useEffect, useRef } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import Graph from 'react-graph-vis';
import './vis.less';

/**
 * Render linked data in a force-directed graph.
 * This was an experimental component and is not being used anywhere at the moment.
 */
export default function ReactGraphComponent(
  props: InferProps<typeof ReactGraphComponent.propTypes>
) {
  const network = useRef({ edges: null, nodes: null, fit: () => {} });

  //NOTE(chab) not 100% sure of the original intent :)
  // but this will fit the network AFTER the rendering
  useEffect(() => {
    if (props.graph && (props.graph as any).nodes && (props.graph as any).edges) {
      network.current.edges = (props.graph as any).edges;
      network.current.nodes = (props.graph as any).nodes;
      network.current.fit();
    }
  }, [(props.graph! as any).nodes, (props.graph! as any).sedges]);

  // the API here is weird.. either we just pass the graph, and the downstream component takes care of it
  // either we update imperatively the graph

  return (
    <Graph
      graph={props.graph}
      options={props.options}
      getNetwork={(network) => (network.current = network)}
    />
  );
}

ReactGraphComponent.propTypes = {
  /**
   * The ID used to identify this component in Dash callbacks
   */
  id: PropTypes.string,

  /**
   * A graph that will be displayed when this component is rendered
   */
  graph: PropTypes.object,

  /**
   * Display options for the graph
   */
  options: PropTypes.object,

  /**
   * Dash-assigned callback that should be called whenever any of the
   * properties change
   */
  setProps: PropTypes.func
};
