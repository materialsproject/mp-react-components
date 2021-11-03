import axios from 'axios';
import classNames from 'classnames';
import React, { useState, useRef, useEffect } from 'react';
import { ItemTypes } from '../../../../archive/search-grid/cards-definition';
import { formatFormula } from '../../utils';
import { MaterialsInputType } from '../MaterialsInput';

export interface InputHelpItem {
  label?: string;
  examples?: string[];
}

interface Props {
  items: InputHelpItem[];
  show?: boolean;
  onChange?: (value: string) => void;
}

/**
 *
 */
export const InputHelp: React.FC<Props> = (props) => {
  return (
    <div
      data-testid="materials-input-help-menu"
      className={classNames('box input-help-menu', {
        'is-hidden': !props.show
      })}
    >
      {props.items.map((item, i) => (
        <div key={`help-example-${i}`}>
          {item.examples && (
            <div>
              {item.label && <strong className="mr-2">{item.label}:</strong>}
              <div className="tags">
                {item.examples.map((example, k) => (
                  <a
                    key={`help-example-${i}-${k}`}
                    className="tag is-medium"
                    onMouseDown={() => {
                      if (props.onChange) props.onChange(example);
                    }}
                  >
                    {example}
                  </a>
                ))}
              </div>
            </div>
          )}
          {!item.examples && item.label && <div className="is-size-7">{item.label}</div>}
        </div>
      ))}
    </div>
  );
};
