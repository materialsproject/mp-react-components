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
  setTimeout(() => setCurrentObject({ jsonObject: object[0], threeUUID: uuids[0] }, 0));
}

export function SceneEditor(props) {
  const scene = useRef((null as unknown) as Simple3DSceneComponenHandles);
  const [editedObject, setEditedObject] = useState(null as any);

  // editor state depends on selected object
  // editor scene is updated only if the whole json/settings change
  return (
    <>
      <div>
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
      </div>
      <SceneWithRef
        {...props}
        onObjectClicked={(objects: any[], uuids: string[]) =>
          onObjectSelected(objects, uuids, setEditedObject)
        }
        ref={scene}
      />
    </>
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
      //scene.updateArrowColor(threeObject, jsonObject, newValue);
      break;
    }
    case 'radius': {
      //scene.updateArroweRadius(threeObject, jsonObject, newValue);
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
      const positionPair = [...jsonObject[id][idx[0]]];
      const position = [...jsonObject[id][idx[0]][idx[1]]] as ThreePosition;
      positionPair[idx[1]] = position;
      position[idx[2]] = newValue;
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
