import { Group, Mesh, Vector3 } from "three";
import { Face, faces, getAxisOfRotation, getFacePieces } from "./getFacePieces";
import { Piece, getCubePositions } from "./createPieces";
import { invalidate } from "@react-three/fiber";
import { FaceColors, colorMaterials, createPiece, faceColorsDefault } from "./createPiece";
import { degToRad } from "three/src/math/MathUtils.js";


export class Cube {

    /** The 26 sub-cubes that form the entire cube */
    pieces: Piece[]

    /** The face that is being rotated */
    currentFace: Face | null = null

    /** The pieces sorted by side (9 per side) */
    facePieces: Record<Face, Piece[]> = {
        U: [],  D: [],
        R: [],  L: [],
        F: [],  B: [],
    }

    /** The target rotation of the pieces of each face */
    targetFaceAngles: Record<Face, number> = {
        U: 0,  D: 0,
        R: 0,  L: 0,
        F: 0,  B: 0,
    }

    constructor() {
        const positions = getCubePositions()
        const pieces = createPieces(positions)
        this.pieces = pieces
        this.updateFacePieces()
    }

    rotateFace(face: Face, clockwise: boolean) {

        this.currentFace = face
        
        // console.log('rotateFace(face: Face, clockwise: boolean)')
        const facePieces = getFacePieces(this.pieces, face)
        const rotationAxis = getAxisOfRotation(face)
        facePieces.forEach(piece => piece.rotation[rotationAxis] += (clockwise ? -1 : 1) * Math.PI/4)
        invalidate()
    }

    changeTargetFaceRotation(face: Face, angle: number, absolute: boolean) {

        if(this.currentFace !== null) {
            console.warn("Cannot rotate a face because another face is rotating.")
            return
        }
        
        this.currentFace = face
        if(absolute)
            this.targetFaceAngles[face] = angle
        else {
            const rotationAxis = getAxisOfRotation(face)
            const currentAngle = this.facePieces[face][0].rotation[rotationAxis]
            this.targetFaceAngles[face] = currentAngle + angle
        }
    }

    setFaceRotation(face: Face, angle: number) {
        const facePieces = this.facePieces[face]
        const rotationAxis = getAxisOfRotation(face)
        facePieces.forEach(piece => {
            piece.rotation[rotationAxis] = angle
        })
    }

    /** Change the rotation of each face piece if necessary.
     *  This is called every frame by useFrame.
     *  Do not call this more than once per frame. */
    updateFaceAngles(angleChange: number) {

        if(!this.currentFace) {
            // console.log("Current face:", this.currentFace)
            return
        }

        const currentFacePieces = this.facePieces[this.currentFace]
        const rotationAxis = getAxisOfRotation(this.currentFace)
        const targetAngle = this.targetFaceAngles[this.currentFace]

        const currentAngle = currentFacePieces[0].rotation[rotationAxis]

        let newAngle = currentAngle

        // If the face is close enough to the target angle, snap the pieces to 90 degrees
        if(hasReachedTargetAngle(currentAngle, targetAngle)) {
            newAngle = targetAngle
            this.updateFacePieces()
            this.setFaceRotation(this.currentFace, targetAngle)
            this.applyFaceRotation(this.currentFace)
            this.currentFace = null
            console.log("Face reached target angle. Applied face rotation.")
            return
        }

        if(targetAngle > currentAngle) {
            newAngle = currentAngle + angleChange
            if(newAngle > targetAngle)
                newAngle = targetAngle
        }
        else {
            newAngle = currentAngle - angleChange
            if(newAngle < targetAngle)
                newAngle = targetAngle
        }

        this.setFaceRotation(this.currentFace, newAngle)
    }

    applyRotations(): void {
        faces.forEach(face => this.applyFaceRotation(face))
    }

    applyFaceRotation(face: Face): void {
        const facePieces = getFacePieces(this.pieces, face)
        facePieces.forEach(piece => applyRotation(piece))
        invalidate()
    }

    updateFacePieces(): void {
        faces.forEach(face => {
            this.facePieces[face] = getFacePieces(this.pieces, face)
        })
    }
}

function hasReachedTargetAngle(startAngle: number, targetAngle: number) {
    const distance = Math.abs(startAngle - targetAngle)
    return distance < degToRad(0.1)
}

function applyRotation(group: Group): void {
    group.updateMatrix()
    group.children.forEach(mesh => (mesh as Mesh).applyMatrix4(group.matrix))
    group.rotation.set(0,0,0)
    group.updateMatrix()
}


function createPieces(positions: Vector3[]): Group[] {

    const pieces: Group[] = []
    
    positions.forEach((pos,i) => {
        const faces = getFacesFromPosition(pos)
        const colors = getPieceColors(faces)
        const mesh = createPiece(colors, pos.toArray(), colorMaterials)
        const group = new Group()
        group.userData["index"] = i
        group.add(mesh)
        pieces.push(group)
    })
    return pieces
}

function getPieceColors1(faces: Set<Face>): FaceColors {

    const colors = { ...faceColorsDefault }

    if(faces.has("L")) {
        colors.R = "black"
    }
    if(faces.has("R")) {
        colors.L = "black"
    }
    if(faces.has("U")) {
        colors.D = "black"
    }
    if(faces.has("D")) {
        colors.U = "black"
    }
    if(faces.has("F")) {
        colors.B = "black"
    }
    if(faces.has("B")) {
        colors.F = "black"
    }
    
    return colors
}

function getPieceColors(faces: Set<Face>): FaceColors {

    const colors: FaceColors = {
        U: "black",
        F: "black",
        D: "black",
        B: "black",
        R: "black",
        L: "black",
    }

    if(faces.has("L")) {
        colors.L = "orange"
    }
    if(faces.has("R")) {
        colors.R = "red"
    }
    if(faces.has("U")) {
        colors.U = "yellow"
    }
    if(faces.has("D")) {
        colors.D = "white"
    }
    if(faces.has("F")) {
        colors.F = "green"
    }
    if(faces.has("B")) {
        colors.B = "blue"
    }
    
    return colors
}

function getFacesFromPosition(pos: Vector3): Set<Face> {
    const faces = new Set<Face>()

    if(pos.y > 0.5)  faces.add("U")
    if(pos.y < -0.5) faces.add("D")
    if(pos.x > 0.5)  faces.add("R")
    if(pos.x < -0.5) faces.add("L")
    if(pos.z > 0.5)  faces.add("F")
    if(pos.z < -0.5) faces.add("B")

    return faces
}