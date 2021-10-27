import axios from 'axios';
import classNames from 'classnames';
import React, { useState, useRef, useEffect } from 'react';
import { ItemTypes } from '../../../../archive/search-grid/cards-definition';
import { formatFormula } from '../../utils';
import { MaterialsInputType } from '../MaterialsInput';

export interface InputHelpItem {
  label: string;
  examples: string[];
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
      className={classNames('input-help-menu', {
        'is-hidden': !props.show
      })}
    >
      <div className="mb-2 is-size-7">Search Examples</div>
      {props.items.map((item, i) => (
        <div key={`help-example-${i}`} className="mb-2">
          <strong>{item.label}:</strong>
          <div className="ml-3 tags">
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
      ))}
      <div className="is-size-7">Additional search options available in the filters panel</div>
    </div>
  );
};
