import PropTypes from 'prop-types';

import React, { Component } from 'react';

import { isNil } from 'ramda';

/*
 * event polyfill for IE
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
 */
function CustomEvent(event, params) {
  // eslint-disable-next-line no-param-reassign
  params = params || {
    bubbles: false,
    cancelable: false,
    // eslint-disable-next-line no-undefined
    detail: undefined
  };
  const evt = document.createEvent('CustomEvent');
  evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
  return evt;
}
CustomEvent.prototype = window.Event.prototype;

/**
 * Link component from dash-core-components that allows you to create a clickable link within a multi-page dash app.
 *
 * The original component has been modified to support the `preserveQuery` prop.
 *
 * See: https://github.com/plotly/dash/blob/dev/components/dash-core-components/src/components/Link.react.js
 */
export class Link extends Component {
  constructor(props) {
    super(props);
    this.updateLocation = this.updateLocation.bind(this);
  }

  updateLocation(e, href) {
    const hasModifiers = e.metaKey || e.shiftKey || e.altKey || e.ctrlKey;
    const { refresh, target } = this.props;

    if (hasModifiers) {
      return;
    }
    if (target !== '_self' && !isNil(target)) {
      return;
    }
    // prevent anchor from updating location
    e.preventDefault();
    if (refresh) {
      window.location = href;
    } else {
      window.history.pushState({}, '', href);
      window.dispatchEvent(new CustomEvent('_dashprivate_pushstate'));
    }
    // scroll back to top
    window.scrollTo(0, 0);
  }

  render() {
    const { className, style, id, href, loading_state, children, title, target, preserveQuery } =
      this.props;
    const hrefWithQuery = preserveQuery ? href + window.location.search : href;
    /*
     * ideally, we would use cloneElement however
     * that doesn't work with dash's recursive
     * renderTree implementation for some reason
     */
    return (
      <a
        data-dash-is-loading={(loading_state && loading_state.is_loading) || undefined}
        id={id}
        className={className}
        style={style}
        href={hrefWithQuery}
        onClick={(e) => this.updateLocation(e, hrefWithQuery)}
        title={title}
        target={target}
      >
        {isNil(children) ? href : children}
      </a>
    );
  }
}

Link.propTypes = {
  /**
   * The children of this component
   */
  children: PropTypes.node,
  /**
   * The URL of a linked resource.
   */
  href: PropTypes.string.isRequired,
  /**
   * Specifies where to open the link reference.
   */
  target: PropTypes.string,
  /**
   * Controls whether or not the page will refresh when the link is clicked
   */
  refresh: PropTypes.bool,
  /**
   * Adds the title attribute to your link, which can contain supplementary
   * information.
   */
  title: PropTypes.string,
  /**
   * Often used with CSS to style elements with common properties.
   */
  className: PropTypes.string,
  /**
   * Defines CSS styles which will override styles previously set.
   */
  style: PropTypes.object,
  /**
   * The ID of this component, used to identify dash components
   * in callbacks. The ID needs to be unique across all of the
   * components in an app.
   */
  id: PropTypes.string,
  /**
   * Object that holds the loading state object coming from dash-renderer
   */
  loading_state: PropTypes.shape({
    /**
     * Determines if the component is loading or not
     */
    is_loading: PropTypes.bool,
    /**
     * Holds which property is loading
     */
    prop_name: PropTypes.string,
    /**
     * Holds the name of the component that is loading
     */
    component_name: PropTypes.string
  }),
  /**
   * If true, the current query parameters will not be removed from the url
   * when following the link.
   */
  preserveQuery: PropTypes.bool
};

Link.defaultProps = {
  refresh: false
};
