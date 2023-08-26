import { Group, Mesh } from "three"


export function applyRotation(group: Group): void {
    group.updateMatrix()
    group.children.forEach(mesh => (mesh as Mesh).geometry.applyMatrix4(group.matrix))
    group.rotation.set(0,0,0)
    group.updateMatrix()
}