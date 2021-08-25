import path from 'path-browserify';

export const linkOnClick = (event, href) => {
  // if ctrl or meta key are held on click, allow default behavior of opening link in new tab
  if (event.metaKey || event.ctrlKey) {
    return;
  }

  // prevent full page reload
  event.preventDefault();
  // update url
  window.history.pushState({}, '', href);

  // communicate to Routes that URL has changed
  const navEvent = new PopStateEvent('popstate');
  window.dispatchEvent(navEvent);
};

/**
 * Join a base url or path with another url or path fragment.
 * Can be used to generate relative or absolute href values for links.
 * @param base the first part of the path string
 * @param rest the second part of the path to join with the base
 * @returns a single valid url or path
 */
export const joinUrl = (base, rest) => {
  if (base.indexOf('http://') === 0 || base.indexOf('https://') === 0) {
    return new URL(rest, base).href;
  } else {
    return path.join(base, rest);
  }
};

export const isUrl = (str: string) => {
  if (str.indexOf('http://') > -1 || str.indexOf('https://') > -1) {
    return true;
  } else {
    return false;
  }
};
