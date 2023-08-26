import { BoxGeometry, MeshNormalMaterial, Vector3 } from "three"


const cubeGeometry = new BoxGeometry(1,1,1)
const cubeMaterial = new MeshNormalMaterial()


type Props = {
    position: Vector3
}

export function Subcube({ position }: Props) {

    return (
        <mesh geometry={ cubeGeometry } material={ cubeMaterial } position={ position }/>
    )
}