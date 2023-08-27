import "./Scene.scss"
import { Canvas, invalidate, useLoader } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, useCubeTexture } from "@react-three/drei"
import { Suspense, useEffect, useRef, useState } from "react"
import { CubeTextureLoader, Group, Material, Mesh, MeshBasicMaterial, Vector3 } from "three"
import { type Piece, getCubePositions } from "../utils/createPieces"
import { Face, faces, getAxisOfRotation, getFacePieces, getWorldPosition } from "../utils/getFacePieces"
import { Rotate2, RotateClockwise2 } from "tabler-icons-react"
import { colorMaterials, createPiece, faceColorsDefault } from "../utils/createPiece"




function createPieces(positions: Vector3[]): Group[] {

    const pieces: Group[] = []
    
    positions.forEach(pos => {
        const mesh = createPiece(faceColorsDefault, pos.toArray(), colorMaterials)
        const group = new Group()
        group.add(mesh)
        pieces.push(group)
    })
    return pieces
}


function applyRotation(group: Group): void {
    group.updateMatrix()
    group.children.forEach(mesh => (mesh as Mesh).applyMatrix4(group.matrix))
    group.rotation.set(0,0,0)
    group.updateMatrix()
}


export function Scene2() {


    const [pieces, setPieces] = useState<Piece[]>([])

    useEffect(() => {
        const positions = getCubePositions()
        const pieces = createPieces(positions)
        setPieces(pieces)
        // const piece = createPiece(faceColorsDefault, [-5,0,5], colorMaterials)
    }, [])
    


    function rotateFace(face: Face, clockwise=true) {
        const facePieces = getFacePieces(pieces, face)
        const rotationAxis = getAxisOfRotation(face)
        
        facePieces.forEach(piece => piece.rotation[rotationAxis] += (clockwise ? -1 : 1) * Math.PI/8)

        invalidate()
    }

    function applyFaceRotation(face: Face) {
        const facePieces = getFacePieces(pieces, face)
        facePieces.forEach(piece => applyRotation(piece))
        invalidate()
    }

    function logWorldPositions() {
        const positions = pieces.map(piece => getWorldPosition(piece))
        console.log(positions)
    }

    return (
        <div id="Scene">
            <div className="controls">
                <button onClick={ () => console.log(pieces) }>Log pieces</button>
                <button onClick={ logWorldPositions }>Log world positions</button>
                {
                    faces.map(face => (
                        <div key={ face }>
                            <button onClick={ () => rotateFace(face, false) }>
                                <Rotate2/> { face }
                            </button>
                            <button onClick={ () => rotateFace(face) }>
                                <RotateClockwise2/> { face }
                            </button>
                            <button onClick={ () => applyFaceRotation(face) }>Apply rotation</button>
                        </div>
                    ))
                }
            </div>
            <Suspense fallback={ null }>
                <Canvas frameloop="demand">
                    <OrbitControls/>
                    <PerspectiveCamera position={ new Vector3(0,10,10) } makeDefault/>

                    <hemisphereLight intensity={ 4 }/>
                    <ambientLight intensity={ 0.3 }/>

                    <group>
                        { pieces.map((piece,i) => (
                            <primitive object={ piece } key={ i }/>
                        )) }
                    </group>

                </Canvas>
            </Suspense>
        </div>
    )
}
