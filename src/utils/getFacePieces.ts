import { Group, Mesh, Vector3 } from "three"
import { Piece } from "./createPieces"
import { applyRotation } from "./applyRotation"


export const faces = ["U", "D", "R", "L", "F", "B"] as const
export type Face = typeof faces[number]


type Axis = "x" | "y" | "z"


const rotationAxes: Record<Face, Axis> = {
    U: "y",
    D: "y",
    R: "x",
    L: "x",
    F: "z",
    B: "z",
}

export function getAxisOfRotation(face: Face) {
    return rotationAxes[face]
}


export function getFacePieces(pieces: Piece[], face: Face): Piece[] {
    
    if(face === "U") {
        return pieces.filter(piece => getWorldPosition(piece).y > 0.5)
    }
    if(face === "D") {
        return pieces.filter(piece => getWorldPosition(piece).y < -0.5)
    }
    if(face === "R") {
        return pieces.filter(piece => getWorldPosition(piece).x > 0.5)
    }
    if(face === "L") {
        return pieces.filter(piece => getWorldPosition(piece).x < -0.5)
    }
    if(face === "F") {
        return pieces.filter(piece => getWorldPosition(piece).z > 0.5)
    }
    if(face === "B") {
        return pieces.filter(piece => getWorldPosition(piece).z < -0.5)
    }
    return []
}


export function getWorldPosition(piece: Piece) {
    const position = new Vector3()
    piece.children[0].getWorldPosition(position)
    const { x, y, z } = position
    return new Vector3(...[x,y,z].map(n => Math.round(n*10)/10))
}


function getAppliedFacePosition(piece: Piece): Vector3 {

    const clone = new Group()
    clone.copy(piece)
    // applyRotation(clone)

    const mesh = clone.children[0] as Mesh
    return mesh.position
    
    // const mesh = piece.children[0] as Mesh
    // const geometry = mesh.geometry
    // geometry.applyMatrix4(piece.matrix)
    // console.log(pos)
    // return geometry
}