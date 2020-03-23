import { Field, FieldType } from '../constants';
import { SketchPicker } from 'react-color';
import React, { useEffect, useState } from 'react';

// three x y z position
export function PositionField(props) {
  const { value: valueX, bind: bindX, reset: resetX } = useInput(props.value[0], e => {
    props.onChange(e, 0);
  });
  const { value: valueY, bind: bindY, reset: resetY } = useInput(props.value[1], e => {
    props.onChange(e, 1);
  });
  const { value: valueZ, bind: bindZ, reset: resetZ } = useInput(props.value[2], e => {
    props.onChange(e, 2);
  });
  return (
    <>
      <input type="number" {...bindX} />
      <input type="number" {...bindY} />
      <input type="number" {...bindZ} />
    </>
  );
}

// two x y z position
export function PositionPairField(props) {
  return (
    <div className="position-pair-container">
      Start
      <PositionField
        value={props.value[0]}
        onChange={(v, positionIndex) => props.onChange(v, positionIndex, 0)}
      />
      End
      <PositionField
        value={props.value[1]}
        onChange={(v, positionIndex) => props.onChange(v, positionIndex, 1)}
      />
    </div>
  );
}

export function ListOfPositionField(props) {
  return props.value.map((value, idx) => (
    <div className="thr-field-container" key={idx}>
      <PositionField value={value} onChange={(v, pidx) => props.onChange(v, [idx, pidx])} />
    </div>
  ));
}

export function ListOfPositionPairField(props) {
  return props.value.map((value, idx) => (
    <div className="thr-field-container" key={idx}>
      <PositionPairField
        onChange={(v, pidx, startEndIndex) => props.onChange(v, [idx, startEndIndex, pidx])}
        value={value}
      />
    </div>
  ));
}

export function ColorField(props) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState(props.value);

  // handle change from parent
  useEffect(() => {
    setColor(props.value);
  }, [props.value]);

  const handleClick = () => {
    setShowColorPicker(!showColorPicker);
  };

  const handleClose = () => {
    setShowColorPicker(false);
  };

  const handleChange = color => {
    console.log('new color', color);
    props.onChange(color.hex);
    setColor(color.hex);
  };

  return (
    <div>
      <div
        style={{
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer'
        }}
        onClick={handleClick}
      >
        <div
          className="swatch"
          style={{
            width: 36,
            height: 36,
            background: `${color}`
          }}
        />
      </div>
      {showColorPicker ? (
        <div>
          <div onClick={handleClose} />
          <SketchPicker color={color} onChange={handleChange} />
        </div>
      ) : null}
    </div>
  );
}

export function StandardField(props) {
  const { value, bind, reset } = useInput(props.value, e => {
    console.log('value changed', e);
    props.onChange(e);
  });
  return <input type="number" {...bind} />;
}

export function SceneFields(props: { fields: Field[]; object; onChange: any }) {
  console.log('p', props);
  return (
    <>
      {props.fields.map((field, idx) => (
        <div className="thr-scene-container" key={field.id}>
          {field.name}
          <EditorField
            field={field}
            onChange={(value, idx = []) => props.onChange(field.id, idx, value)}
            value={props.object[field.id]}
          />
        </div>
      ))}
    </>
  );
}

export function EditorField({ field, value, onChange }: { field: Field; value: any; onChange }) {
  const getContent = (type: FieldType) => {
    switch (type) {
      case FieldType.COLOR: {
        return <ColorField value={value} onChange={v => onChange(v, [])} />;
      }
      case FieldType.NUMBER: {
        return <StandardField value={value} onChange={v => onChange(v, [])} />;
      }
      case FieldType.LIST: {
        switch (field.listModel) {
          case FieldType.VEC3: {
            return <ListOfPositionField value={value} onChange={(v, idx) => onChange(v, idx)} />;
          }
          case FieldType.VEC3_PAIRS: {
            return (
              <ListOfPositionPairField value={value} onChange={(v, idx) => onChange(v, idx)} />
            );
          }
        }
        console.log('should not get there...', field, value);
      }
      default: {
        console.warn('Non implemented type');
        return <div></div>;
      }
    }
  };

  return <>{getContent(field.type)}</>;
}

// form hooks
export const useInput = (initialValue, changeCb) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  return {
    value,
    setValue,
    reset: () => setValue(initialValue),
    bind: {
      value,
      onChange: event => {
        setValue(event.target.value);
        changeCb && changeCb(event.target.value);
      }
    }
  };
};
