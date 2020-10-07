import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { rgb } from 'd3-color';

export class TooltipHelper {
  private tooltipedJsonObject: any | null = null;
  private tooltipedThreeObject: THREE.Object3D | null = null;
  public readonly tooltip;

  constructor() {
    const label = document.createElement('div');
    label.className = 'tooltiptext';
    const hoverLabel = document.createElement('span');
    hoverLabel.className = '';
    label.appendChild(hoverLabel);
    const labelObject = new CSS2DObject(label);
    this.tooltip = labelObject;
    this.moveOffscreen();
  }

  public updateTooltip(point, jsonObject: any, sceneObject: THREE.Object3D) {
    if (!(this.tooltipedJsonObject === jsonObject)) {
      sceneObject.children.forEach(c => {
        if (c instanceof THREE.Mesh) {
          const color = rgb(jsonObject.color).brighter(1);
          (c.material as THREE.MeshStandardMaterial).color = new THREE.Color(color.formatHex());
        }
      });
      this.tooltipedJsonObject = jsonObject;
      this.tooltipedThreeObject = sceneObject;
    }
    this.tooltip.position.x = point.x;
    this.tooltip.position.y = point.y;
    this.tooltip.position.z = point.z;
    // TODO(chab) support markdown ?
    this.tooltip.element.textContent = jsonObject.tooltip;
  }

  /**
   *
   * Return true if the tooltip was removed
   */
  public hideTooltipIfNeeded(): boolean {
    if (this.tooltipedThreeObject) {
      this.tooltipedThreeObject.children.forEach(c => {
        if (c instanceof THREE.Mesh) {
          (c.material as THREE.MeshStandardMaterial).color = new THREE.Color(
            this.tooltipedJsonObject!.color
          );
        }
      });
      this.tooltipedThreeObject = null;
      this.tooltipedJsonObject = null;
      this.moveOffscreen();
      return true;
    }
    return false;
  }

  private moveOffscreen() {
    this.tooltip.translateX(Number.MAX_SAFE_INTEGER);
    this.tooltip.translateY(Number.MAX_SAFE_INTEGER);
    this.tooltip.translateZ(Number.MAX_SAFE_INTEGER);
  }
}
