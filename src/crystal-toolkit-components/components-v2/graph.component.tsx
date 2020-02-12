import React, { Component } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import Graph from 'react-graph-vis';
import './vis.css';

interface State {
  network?: any;
}

/**
 * GraphComponent renders a force-directed graph using
 * react-graph-vis by @crubier and vis.js
 */
export default class ReactGraphComponent extends Component<
  InferProps<typeof ReactGraphComponent.propTypes>,
  State
> {
  static propTypes = {
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

  constructor(public props, context) {
    super(props, context);
    this.state = { network: {} };
  }

  render() {
    const { graph, options, setProps } = this.props;

    return (
      <Graph
        graph={graph}
        options={options}
        getNetwork={network => this.setState({ network: network })}
      />
    );
  }

  componentWillUpdate(nextProps, nextState) {
    // FIXME
    if (nextProps!.graph !== this.props.graph) {
      this.state.network.nodes = nextProps!.graph.nodes;
      this.state.network.edges = nextProps!.graph.edges;
      this.forceUpdate();
      this.state.network.fit();
    }
  }
}
