import { Mesh, BoxGeometry, MeshNormalMaterial, Vector3, Group } from "three"
import { createColoredPieceGeometry } from "./createColoredPieceGeometry"



export type Piece = Group



export function getCubePositions(): Vector3[] {
    const positions: Vector3[] = []
    
    for(let layer=0; layer<3; layer++) {
        for(let row=0; row<3; row++) {
            for(let col=0; col<3; col++) {

                const isOriginPosition = layer===1 && row===1 && col===1
                if(!isOriginPosition) {
                    positions.push(new Vector3(layer-1, row-1, col-1).multiplyScalar(1.01))
                }
            }
        }
    }
    return positions
}

// const positions = getCubePositions()



export function createPiece(position: Vector3): Piece {

    // const cubeGeometry = new BoxGeometry(1,1,1)
    // const cubeMaterial = new MeshNormalMaterial()

    // const { geometry, material } = createColoredPieceGeometry()
    const { geometry, material } = createPieceGeometry()
    
    const cube = new Mesh(geometry, material)


    // const subCube = new Mesh(new BoxGeometry(0.2,0.2,0.2), new MeshNormalMaterial())

    const group = new Group()
    
    const { x, y, z } = position
    cube.position.set(x,y,z)

    group.add(cube)

    // group.add(subCube)

    return group
}


function createPieceGeometry() {
    return {
        geometry: new BoxGeometry(1,1,1),
        material: new MeshNormalMaterial()
    }
}


export function createPieces(): Piece[] {
    const positions = getCubePositions()

    const cubes = positions.map(position => {
        return createPiece(position)
    })

    return cubes
}