import { DoubleSide, Group, Material, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry } from "three"
import { Face } from "./getFacePieces"


type FaceColor =
    | "red"
    | "black"
    | "blue"
    | "white"
    | "green"
    | "orange"
    | "yellow"


type ColorMaterials = {
    "red": Material
    "black": Material
    "blue": Material
    "white": Material
    "green": Material
    "orange": Material
    "yellow": Material
}

export const colorMaterials: ColorMaterials = {
    "blue": new MeshBasicMaterial({ color: "blue", side: DoubleSide }),
    "white": new MeshBasicMaterial({ color: "white", side: DoubleSide }),
    "green": new MeshBasicMaterial({ color: "green", side: DoubleSide }),
    "black": new MeshBasicMaterial({ color: "#333", side: DoubleSide }),
    "red": new MeshBasicMaterial({ color: "red", side: DoubleSide }),
    "yellow": new MeshBasicMaterial({ color: "yellow", side: DoubleSide }),
    "orange": new MeshBasicMaterial({ color: "orange", side: DoubleSide }),
}


export type FaceColors = Record<Face, FaceColor>

export const faceColorsDefault: FaceColors = {
    U: "yellow",
    F: "green",
    D: "white",
    B: "blue",
    R: "red",
    L: "orange",
}


function rotateFace(object: Object3D, face: Face): Object3D {
    switch (face) {
        case "F": break
        case "B": object.rotation.y = Math.PI; break
        case "U": object.rotation.x = -Math.PI/2; break
        case "L": object.rotation.y = -Math.PI/2; break
        case "R": object.rotation.y = Math.PI/2; break
        case "D": object.rotation.x = Math.PI/2; break
    }

    return object
}

export function createPiece(faceColors: FaceColors, position: [number,number,number], colors: ColorMaterials): Group {

    const group = new Group()

    Object.entries(faceColors).forEach(([face,color]) => {
        const faceObject = createFace(face as Face, color, colors)
        group.add(faceObject)
    })

    group.position.set(...position)

    return group
}


function createFace(face: Face, color: FaceColor, colors: ColorMaterials): Group {

    const geometry = new PlaneGeometry(1,1)
    // const material = new MeshBasicMaterial({ color, side: DoubleSide })
    const material = colors[color]
    const faceMesh = new Mesh(geometry, material)
    faceMesh.position.z = 0.5

    const faceGroup = new Group()
    faceGroup.add(faceMesh)
    rotateFace(faceGroup, face)

    return faceGroup
}
