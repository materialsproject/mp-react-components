import classNames from 'classnames';
import React, { ReactNode } from 'react';

interface KeyLabelPair {
  key: string;
  label: string;
}

interface Props {
  id?: string;
  setProps?: (value: any) => any;
  className?: string;
  data: object;
  levelOneKey?: string;
  levelTwoKey?: string;
  levelThreeKeys?: KeyLabelPair[];
  leftComponent?: ReactNode;
}

export const DataCard: React.FC<Props> = (props) => {
  return (
    <div className={classNames('mpc-data-card', props.className)}>
      <div>{props.leftComponent}</div>
      <div>
        {props.levelOneKey && <p>{props.data[props.levelOneKey]}</p>}
        {props.levelTwoKey && <p>{props.data[props.levelTwoKey]}</p>}
        <div>
          {props.levelThreeKeys?.map((d, i) => (
            <div key={`mpc-data-card-three-${i}`}>
              <p>{d.label}</p>
              <p>{props.data[d.key] || '-'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
