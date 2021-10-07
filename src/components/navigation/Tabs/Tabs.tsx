import classNames from 'classnames';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Tab, Tabs as ReactTabs, TabList, TabPanel } from 'react-tabs';

interface Props {
  /**
   * The ID used to identify this component in Dash callbacks
   */
  id?: string;

  /**
   * Dash-assigned callback that should be called whenever any of the
   * properties change
   */
  setProps?: (value: any) => any;

  /**
   * Class name applied to top level wrapper for tabs and tab content.
   * The "mpc-tabs" class is added automatically
   */
  className?: string;

  /**
   * List of strings to use as labels for the tabs.
   * The number of labels must equal the number of children (i.e. tab content items).
   */
  labels: string[];

  /**
   * The current or default tabIndex to be active.
   * This value can be watched and changed from outside the component (e.g. via dash callback).
   */
  tabIndex?: number;

  /**
   * Allow an object of arbitrary props to also
   * be added to the react-tabs component.
   *
   * This is workaround to let the Dash component
   * version of this component accept extra props
   * supported by react-tabs without the need to explicitly
   * define those props in the component's propTypes.
   */
  arbitraryProps?: object;
}

/**
 * Custom Tabs component based on react-tabs.
 * See https://github.com/reactjs/react-tabs
 *
 * This component will only render a tab's content once it has been activated.
 * After it's been activated, the tab's content will stay rendered and will be
 * shown/hidden using css only.
 */
export const Tabs: React.FC<Props> = ({
  setProps = () => null,
  className,
  labels,
  tabIndex = 0,
  arbitraryProps,
  children,
  ...otherProps
}) => {
  const tabProps = { ...otherProps, ...arbitraryProps };
  const [internalTabIndex, setInternalTabIndex] = useState(tabIndex);

  /**
   * Dynamically update the tabIndex prop so that the
   * active tab index can be accessed via dash callbacks.
   */
  useEffect(() => {
    setProps({ tabIndex: internalTabIndex });
  }, [internalTabIndex]);

  /**
   * Allow changes to tabIndex from outside the component
   * (e.g. to change active tabIndex via dash callback).
   */
  useEffect(() => {
    setInternalTabIndex(tabIndex);
  }, [tabIndex]);

  return (
    <ReactTabs
      className={classNames('mpc-tabs', className)}
      selectedTabClassName="is-active"
      selectedIndex={internalTabIndex}
      forceRenderTabPanel={true}
      onSelect={(index) => setInternalTabIndex(index)}
      {...tabProps}
    >
      <div className="tabs">
        <TabList>
          {labels.map((label, i) => (
            <Tab key={`tab-${i}`}>
              <a>{label}</a>
            </Tab>
          ))}
        </TabList>
      </div>
      {React.Children.map(children, (child, i) => (
        <TabPanel
          className={classNames({ 'is-hidden': internalTabIndex !== i })}
          key={`tab-panel-${i}`}
        >
          <CachedTab isActive={internalTabIndex === i}>{child}</CachedTab>
        </TabPanel>
      ))}
    </ReactTabs>
  );
};

/**
 * Component that wraps a tab's content and keeps it rendered once it has been activated.
 * After it has been activated, it is hidden with css.
 * Before it has been activated, it is not rendered at all.
 */
const CachedTab: React.FC<any> = ({ isActive = false, children }) => {
  const [hasBeenActivated, setHasBeenActivated] = useState(() => isActive);

  useEffect(() => {
    if (isActive) setHasBeenActivated(true);
  }, [isActive]);

  return (
    <>
      {(isActive || hasBeenActivated) && (
        <div className={classNames({ 'is-hidden': !isActive })}>{children}</div>
      )}
    </>
  );
};
