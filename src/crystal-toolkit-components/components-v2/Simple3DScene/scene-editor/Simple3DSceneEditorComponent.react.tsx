// a change has the name of the object,
// the UUID of the object,
// the name of the property,
// the new value,
// the key/index if it's an array
// if the key/index is null, then we are changing the whole property ( if it's an array/object )
import React, { useRef, useState } from 'react';
import { SceneWithRef, Simple3DSceneComponenHandles } from '../Simple3DSceneComponent.react';
import { FieldType, JSON3DObject, OBJECT_TO_FIELDS, ThreePosition } from '../constants';
import { SceneFields } from './scene-editor-fields';
import Simple3DScene from '../Simple3DScene';

function onObjectSelected(object: any[], uuids: string[], setCurrentObject) {
  // it would be simpler to have a null object if nothing is selected
  setTimeout(() => setCurrentObject({ jsonObject: object[0], threeUUID: uuids[0] }, 0));
}

function showDebug(debug: boolean, forceDebug: boolean): boolean {
  return forceDebug || debug;
}

export function SceneEditor(props) {
  const scene = useRef((null as unknown) as Simple3DSceneComponenHandles);
  const [editedObject, setEditedObject] = useState(null as any);
  const [forceDebug, setForceDebug] = useState(false);

  const onObjectClicked = (objects: any[], uuids: string[]) =>
    onObjectSelected(objects, uuids, setEditedObject);
  // editor state depends on selected object
  // editor scene is updated only if the whole json/settings change

  return (
    <div className="editor-wrapper">
      <div className="editor" style={{ width: 500 }}>
        {!editedObject ||
          (!editedObject.threeUUID && (
            <div style={{ margin: 'auto' }}> Select an object on the screen to edit it</div>
          ))}

        {!!editedObject && editedObject.jsonObject && editedObject.jsonObject.length !== 0 ? (
          <SceneFields
            object={editedObject.jsonObject}
            onChange={(fieldId: string, fieldIdx: number[], newValue) => {
              updateObject(scene.current.current, editedObject, fieldId, newValue, fieldIdx);
            }}
            fields={OBJECT_TO_FIELDS[editedObject.jsonObject.type]}
          />
        ) : (
          <div />
        )}

        <button
          style={{ marginTop: 'auto', marginBottom: 'auto' }}
          onClick={() => {
            scene.current.current.download();
          }}
        >
          Download PNG
        </button>
        <button
          style={{ marginTop: 'auto', marginBottom: 'auto' }}
          onClick={() => {
            setForceDebug(!forceDebug);
          }}
        >
          {' '}
          Toggle Debug View
        </button>
      </div>
      <SceneWithRef
        {...{ ...props, debug: showDebug(props.debug, forceDebug) }}
        onObjectClicked={onObjectClicked}
        ref={scene}
      />
    </div>
  );
}
// update function

function updateObject(
  scene: Simple3DScene,
  { threeUUID, jsonObject },
  id: string,
  newValue: any,
  idx: number[]
) {
  console.log(scene);
  const object = scene.findObjectByUUID(threeUUID);
  if (!object || !object.threeObject) {
    console.error('object does not exist', jsonObject);
    return;
  }
  internalUpdateObject(scene, jsonObject, object.threeObject, id, newValue, idx);
  if (scene.registry.registryHasObject(object.threeObject)) {
    const oldOutlineObject = scene.registry.getObjectFromRegistry(threeUUID);
    if (id === 'positions' || id === 'positionPairs') {
      // TODO(chab) the outline scene just clone objects from the main scene, so it's missing the
      // transform hierarchy.
      // to have a correct rendering, we re-clone the updated three object, so the object gets the correct position

      object.threeObject.updateWorldMatrix(false, true);
      const clonedObject = object.threeObject!.clone();
      clonedObject.uuid = threeUUID;
      scene.registry.addToObjectRegisty(clonedObject);
      scene.replaceOutlineObject(oldOutlineObject, clonedObject);
    } else {
      internalUpdateObject(scene, jsonObject, oldOutlineObject, id, newValue, idx);
    }
  }
  scene.renderScene();
}

// THE UNDERLYING JSON IS ~~NOT~~ UPDATED, which can cause trouble, as we rely on it
// either we ignore it completly, and just map to THREE value
// BUT mapping to three is not possible because we loose some values when we build the object...
// e.g, the position pair of the cylinder disappears
function internalUpdateObject(
  scene: Simple3DScene,
  jsonObject,
  threeObject: THREE.Object3D,
  id: string,
  newValue,
  idx: number[]
) {
  // update json accordingly
  // FIXME(chab) decouple the update of the json
  switch (id) {
    case 'color':
    case 'radius':
    case 'headWidth': {
      jsonObject[id] = newValue;
      break;
    }
    case 'positions': {
      (jsonObject[id][idx[0]] as ThreePosition)[idx[1]] = Number.parseFloat(newValue);
      break;
    }
    case 'positionPairs': {
      break;
      const positionPair = jsonObject[id][idx[0]];
      const position = jsonObject[id][idx[0]][idx[1]] as ThreePosition;
      positionPair[idx[1]] = position;
      position[idx[2]] = Number.parseFloat(newValue);
      break;
    }
  }

  const objectType: JSON3DObject = jsonObject.type as JSON3DObject;
  switch (objectType) {
    case JSON3DObject.SPHERES: {
      updateSphere(scene, jsonObject, threeObject, id, newValue, idx);
      break;
    }
    case JSON3DObject.CYLINDERS: {
      updateCylinder(scene, jsonObject, threeObject, id, newValue, idx);
      break;
    }
    case JSON3DObject.ARROWS: {
      updateArrow(scene, jsonObject, threeObject, id, newValue, idx);
      break;
    }
  }
}

function updateArrow(
  scene: Simple3DScene,
  jsonObject,
  threeObject: THREE.Object3D,
  id: string,
  newValue,
  idx: number[]
) {
  switch (id) {
    case 'color': {
      scene.updateArrowColor(threeObject, jsonObject, newValue);
      break;
    }
    case 'radius': {
      scene.updateArrowRadius(threeObject, jsonObject, newValue);
      break;
    }
    case 'headWidth': {
      scene.updateHeadWidth(threeObject, jsonObject, newValue);
      break;
    }
    case 'headLength': {
      scene.updateHeadLength(threeObject, jsonObject, newValue);
      break;
    }
  }
}

function updateCylinder(
  scene: Simple3DScene,
  jsonObject,
  threeObject,
  id: string,
  newValue,
  idx: number[]
) {
  switch (id) {
    case 'color': {
      scene.updateCylinderColor(threeObject, jsonObject, newValue);
      break;
    }
    case 'radius': {
      scene.updateCylinderRadius(threeObject, jsonObject, newValue);
      break;
    }
    case 'positionPairs': {
      const parsedValue = Number.parseFloat(newValue);
      const positionPair = [...jsonObject[id][idx[0]]];
      const position = [...jsonObject[id][idx[0]][idx[1]]] as ThreePosition;
      console.log(positionPair);
      position[idx[2]] = parsedValue;
      positionPair[idx[1]] = position;
      console.log(positionPair);
      scene.updateCylinderPositionPair(threeObject, jsonObject, positionPair, idx[0]);
      break;
    }
  }
}

function updateSphere(
  scene: Simple3DScene,
  jsonObject,
  threeObject,
  id: string,
  newValue,
  idx: number[]
) {
  switch (id) {
    case 'color': {
      scene.updateSphereColor(threeObject, jsonObject, newValue);
      break;
    }
    case 'radius': {
      scene.updateSphereRadius(threeObject, jsonObject, newValue);
      break;
    }
    case 'positions': {
      const position = [...jsonObject[id][idx[0]]] as ThreePosition;
      position[idx[1]] = Number.parseFloat(newValue);
      scene.updateSphereCenter(threeObject, jsonObject, position, idx[0]);
      break;
    }
  }
}
