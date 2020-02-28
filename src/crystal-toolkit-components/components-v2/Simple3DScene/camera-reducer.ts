import { Quaternion, Vector3 } from 'three';
import { Action } from './utils';

export interface CameraState {
  quaternion?: Quaternion;
  position?: Vector3;
  zoom?: number;
  fromComponent?: string;
  following: boolean;
}

export const initialState = {
  following: true
};

export enum CameraReducerAction {
  NEW_POSITION = 'follow_camera',
  STOP_FOLLOWING = 'stop_following',
  START_FOLLOWING = 'start_following'
}

// use conditional type to map actions
export interface CameraActionPayload {
  quaternion?: Quaternion;
  position?: Vector3;
  componentId?: string; // id of component whose component moved
  following?: boolean; // whether to follow the camera
}

export function cameraReducer(
  state: CameraState,
  { type, payload }: Action<CameraReducerAction, CameraActionPayload>
): CameraState {
  // we expect the new position/orientation, and the ID of the component
  // (to avoid resetting the position )
  switch (type) {
    case CameraReducerAction.NEW_POSITION:
      return {
        quaternion: payload.quaternion!.clone(),
        position: payload.position!.clone(),
        fromComponent: payload.componentId,
        following: state.following
      };
    case CameraReducerAction.STOP_FOLLOWING:
      return { ...state, following: false };
    case CameraReducerAction.START_FOLLOWING:
      return { ...state, following: true };
    default:
      console.error('Unknown action, return current state. Action', type, payload);
  }
  return state;
}
