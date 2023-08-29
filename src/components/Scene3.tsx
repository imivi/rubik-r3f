import "./Scene.scss"
import { Canvas, ThreeEvent, invalidate, useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Suspense, useState } from "react"
import { Vector3 } from "three"
import { type Piece } from "../utils/createPieces"
import { Face, faces, getWorldPosition } from "../utils/getFacePieces"
import { Rotate2, RotateClockwise2 } from "tabler-icons-react"
import { Cube } from "../utils/Cube"
import { useKeypress } from "../hooks/useKeypress"





export function Scene3() {

    // const cubeRef = useRef<Cube|null>()
    const [cube, setCube] = useState(new Cube())

    // useEffect(() => {
    //     cubeRef.current = new Cube()
    //     invalidate()
    // }, [])

    function resetCube() {
        setCube(new Cube())
    }
    
    function logWorldPositions() {
        const positions = cube.pieces.map(piece => getWorldPosition(piece))
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

    useKeypress((key, shift) => {
        const direction = shift ? 1 : -1
        if(faces.includes(key as Face)) {
            cube.changeTargetFaceRotation(key as Face, direction * Math.PI/2, false)
        }
    })

    return (
        <div id="Scene">
            <div className="controls">
                <button onClick={ () => console.log(cube) }>Log cube</button>
                <button onClick={ logWorldPositions }>Log world positions</button>
                <button onClick={ () => cube.applyRotations() }>Apply rotations</button>
                <button onClick={ resetCube }>Reset cube</button>
                <div>Current face: { cube.currentFace }</div>
                {
                    faces.map(face => (
                        <div key={ face }>
                            <button onClick={ () => cube.changeTargetFaceRotation(face, Math.PI/2, false) }>
                                <Rotate2/> { face }
                            </button>
                            <button onClick={ () => cube.changeTargetFaceRotation(face, -Math.PI/2, false) }>
                                <RotateClockwise2/> { face }
                            </button>
                            <button onClick={ () => cube.applyFaceRotation(face) } disabled>Apply rotation</button>
                        </div>
                    ))
                }
            </div>
            <Suspense fallback={ null }>
                <Canvas frameloop="always">
                    <OrbitControls/>
                    <PerspectiveCamera position={ new Vector3(0,10,10) } makeDefault/>

                    <hemisphereLight intensity={ 4 }/>
                    <ambientLight intensity={ 0.3 }/>

                    <CubeObj cube={ cube } animate={ true } onPointerDown={ handlePointerDown }/>

                </Canvas>
            </Suspense>
        </div>
    )
}



type Props = {
    cube: Cube
    animate: boolean
    onPointerDown: (event: ThreeEvent<PointerEvent>) => void
}

function CubeObj({ cube, animate, onPointerDown }: Props) {

    useFrame((state, delta, frame) => {
        if(animate) {
            // const topFacePieces = cube.facePieces["U"]
            // topFacePieces.forEach(piece => piece.rotation.y += delta * 3)
            cube.updateFaceAngles(0.1)
        }
    })

    // const { raycaster } = useThree()

    return <>
        { cube.pieces.map((piece,i) => (
            <primitive
                object={ piece }
                key={ i }
                // onPointerDown={ (e) => onPointerDown(e) }
            />
        )) }
    </>
}
