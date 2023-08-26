import { Piece } from "./createPieces"


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
        return pieces.filter(group => group.children[0].position.y > 0.5)
    }
    if(face === "D") {
        return pieces.filter(group => group.children[0].position.y < -0.5)
    }
    if(face === "R") {
        return pieces.filter(group => group.children[0].position.x > 0.5)
    }
    if(face === "L") {
        return pieces.filter(group => group.children[0].position.x < -0.5)
    }
    if(face === "F") {
        return pieces.filter(group => group.children[0].position.z > 0.5)
    }
    if(face === "B") {
        return pieces.filter(group => group.children[0].position.z < -0.5)
    }
    return []
}