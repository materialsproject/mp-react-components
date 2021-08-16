import classNames from 'classnames';
import React, { ReactNode } from 'react';
import './DataCard.css';

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
    <div id={props.id} className={classNames('mpc-data-card', props.className)}>
      <div className="mpc-data-card-left">{props.leftComponent}</div>
      <div className="mpc-data-card-right">
        {props.levelOneKey && <p className="title is-4">{props.data[props.levelOneKey]}</p>}
        {props.levelTwoKey && <p className="subtitle">{props.data[props.levelTwoKey]}</p>}
        <div className="mpc-data-card-right-bottom">
          <div>
            {props.levelThreeKeys && props.levelThreeKeys[0] && (
              <div>
                <p>{props.levelThreeKeys[0].label}</p>
                <p>{props.data[props.levelThreeKeys[0].key] || '-'}</p>
              </div>
            )}
            {props.levelThreeKeys && props.levelThreeKeys[1] && (
              <div>
                <p>{props.levelThreeKeys[1].label}</p>
                <p>{props.data[props.levelThreeKeys[1].key] || '-'}</p>
              </div>
            )}
          </div>
          <div>
            {props.levelThreeKeys && props.levelThreeKeys[2] && (
              <div>
                <p>{props.levelThreeKeys[2].label}</p>
                <p>{props.data[props.levelThreeKeys[2].key] || '-'}</p>
              </div>
            )}
            {props.levelThreeKeys && props.levelThreeKeys[3] && (
              <div>
                <p>{props.levelThreeKeys[3].label}</p>
                <p>{props.data[props.levelThreeKeys[3].key] || '-'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
