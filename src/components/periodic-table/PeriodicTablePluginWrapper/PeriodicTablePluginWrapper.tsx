import React from 'react';

interface Props {
  upper?: boolean;
}

export const PeriodicTablePluginWrapper: React.FC<Props> = (props) => {
  return (
    <>
      <div className="first-span">{props.upper && props.children}</div>
      <div className="second-span">{!props.upper && props.children}</div>
    </>
  );
};
