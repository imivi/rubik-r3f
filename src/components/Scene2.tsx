import "./Scene.scss"
import { Canvas, ThreeEvent, invalidate, useFrame, useLoader, useThree } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, useCubeTexture } from "@react-three/drei"
import { ReactNode, Suspense, useEffect, useRef, useState } from "react"
import { CubeTextureLoader, Group, Material, Mesh, MeshBasicMaterial, Vector3 } from "three"
import { type Piece, getCubePositions } from "../utils/createPieces"
import { Face, faces, getAxisOfRotation, getFacePieces, getWorldPosition } from "../utils/getFacePieces"
import { Rotate2, RotateClockwise2 } from "tabler-icons-react"
import { colorMaterials, createPiece, faceColorsDefault } from "../utils/createPiece"




function createPieces(positions: Vector3[]): Group[] {

    const pieces: Group[] = []
    
    positions.forEach((pos,i) => {
        const mesh = createPiece(faceColorsDefault, pos.toArray(), colorMaterials)
        const group = new Group()
        group.userData["index"] = i
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

/*
function Scene2({ children }: { children: ReactNode }) {
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

                    { children }

                </Canvas>
            </Suspense>
        </div>
    )
}
*/

export function Scene2() {


    const [pieces, setPieces] = useState<Piece[]>([])

    const currentFacePiecesRef = useRef<Piece[]>([])
    const targetRotationRef = useRef(new Vector3(0,0,0))

    // useFrame(() => {
    //     const facePieces = currentFacePiecesRef.current
    //     if(facePieces.length === 0) {
    //         return
    //     }
    //     // const targetRotation = targetRotationRef.current
    //     facePieces.forEach(piece => piece.rotation.x += 0.1)
    // })


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

    function handlePointerDown(event: ThreeEvent<PointerEvent>) {
        // event.stopPropagation()

        // console.log(event.intersections)
        const intersectedFaces = event.intersections
        const intersectedPieces = intersectedFaces.map(int => int.eventObject.parent)

        const piecesIds = new Set(intersectedPieces.map(piece => piece?.uuid))
        console.log(intersectedPieces, piecesIds)
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

                    <Cube pieces={ pieces } onPointerDown={ handlePointerDown }/>

                </Canvas>
            </Suspense>
        </div>
    )
}




function Cube({ pieces, onPointerDown }: { pieces: Piece[], onPointerDown: (event: ThreeEvent<PointerEvent>) => void }) {

    // useFrame((state, delta, frame) => {
    //     console.log(state.raycaster)
    // })

    // const { raycaster } = useThree()

    return <>
        { pieces.map((piece,i) => (
            <primitive
                object={ piece }
                key={ i }
                // onPointerDown={ (e) => onPointerDown(e) }
            />
        )) }
    </>
}
