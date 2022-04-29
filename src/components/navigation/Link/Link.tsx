import React, { ReactNode } from 'react';

/*
 * event polyfill for IE
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
 */
function CustomEvent(event: string, params?) {
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

interface LinkProps {
  /**
   * The children of this component
   */
  children: ReactNode;
  /**
   * The URL of a linked resource.
   */
  href: string;
  /**
   * Specifies where to open the link reference.
   */
  target?: string;
  /**
   * Controls whether or not the page will refresh when the link is clicked
   */
  refresh?: boolean;
  /**
   * Adds the title attribute to your link, which can contain supplementary
   * information.
   */
  title?: string;
  /**
   * Often used with CSS to style elements with common properties.
   */
  className?: string;
  /**
   * Defines CSS styles which will override styles previously set.
   */
  style?: object;
  /**
   * The ID of this component, used to identify dash components
   * in callbacks. The ID needs to be unique across all of the
   * components in an app.
   */
  id?: string;
  /**
   * Object that holds the loading state object coming from dash-renderer
   */
  loading_state?: any;
  /**
   * If true, the current query parameters will not be removed from the url
   * when following the link.
   */
  preserveQuery?: boolean;
}

/**
 * Link component from dash-core-components that allows you to create a clickable link within a multi-page dash app.
 *
 * The original component has been modified to support the `preserveQuery` prop.
 *
 * See: https://github.com/plotly/dash/blob/dev/components/dash-core-components/src/components/Link.react.js
 */
export const Link: React.FC<LinkProps> = (props) => {
  const hrefWithQuery = props.preserveQuery ? props.href + window.location.search : props.href;

  const updateLocation = (e, href) => {
    const hasModifiers = e.metaKey || e.shiftKey || e.altKey || e.ctrlKey;

    if (hasModifiers) {
      return;
    }
    if (props.target !== '_self' && props.target !== undefined && props.target !== null) {
      return;
    }
    // prevent anchor from updating location
    e.preventDefault();
    if (props.refresh) {
      window.location = href;
    } else {
      window.history.pushState({}, '', href);
      window.dispatchEvent(CustomEvent('_dashprivate_pushstate'));
    }
    // scroll back to top
    window.scrollTo(0, 0);
  };

  /*
   * ideally, we would use cloneElement however
   * that doesn't work with dash's recursive
   * renderTree implementation for some reason
   */
  return (
    <a
      data-dash-is-loading={(props.loading_state && props.loading_state.is_loading) || undefined}
      id={props.id}
      className={props.className}
      style={props.style}
      href={hrefWithQuery}
      onClick={(e) => updateLocation(e, hrefWithQuery)}
      title={props.title}
      target={props.target}
    >
      {props.children === undefined || props.children === null ? hrefWithQuery : props.children}
    </a>
  );
};
