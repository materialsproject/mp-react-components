import { Quaternion, Vector3 } from 'three';
import { Action } from '../utils';

export interface CameraState {
  quaternion?: Quaternion;
  position?: Vector3;
  zoom?: number;
  /**
   * The id of the scene component that most recently set
   * the camera state values.
   * e.g. "1"
   */
  setByComponentId?: string;
  /**
   * whether to follow the camera
   * (what does this mean?)
   */
  following?: boolean;
}

export interface CameraActionPayload {
  quaternion?: Quaternion;
  position?: Vector3;
  zoom?: number;
  /**
   * The id of the component that is initiating
   * the camera change. Sets the state value for setByComponentId.
   * e.g. "1"
   */
  componentId?: string;
  following?: boolean;
}

export enum CameraReducerAction {
  NEW_POSITION = 'follow_camera',
  STOP_FOLLOWING = 'stop_following',
  START_FOLLOWING = 'start_following',
}

export const initialState = {
  following: true,
};

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
        zoom: payload.zoom,
        setByComponentId: payload.componentId,
        following: state.following,
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
