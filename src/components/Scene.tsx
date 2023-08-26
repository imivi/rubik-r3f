import "./Scene.scss"
import { Canvas, invalidate } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Suspense, useState } from "react"
import { Vector3 } from "three"
import { type Piece, createPieces } from "../utils/createPieces"
import { Face, faces, getAxisOfRotation, getFacePieces } from "../utils/getFacePieces"
import { applyRotation } from "../utils/applyRotation"
import { Rotate2, RotateClockwise2 } from "tabler-icons-react"




const pieces: Piece[] = createPieces()

const upAxis = new Vector3(0,1,0)

export function Scene() {

    // const [targetRotation, setTargetRotation] = useState(0)
    
    // console.log(positions)

    // const [cubes] = useState(createCubes())

    /*
    useEffect(() => {
        cubesRef.current = createCubes()
        console.log("Created cubes:", cubesRef.current)
        setCount((count) => count+1)
    }, [])
    */

    function rotateFace(face: Face, clockwise=true) {
        const facePieces = getFacePieces(pieces, face)
        const rotationAxis = getAxisOfRotation(face)
        // console.log({ pieces })

        facePieces.forEach(piece => piece.rotation[rotationAxis] += (clockwise ? -1 : 1) * Math.PI/12)

        // setTargetRotation(Math.PI/2)

        // cubes.active.rotation[rotationAxis] += Math.PI/12

        // cubes.active.rotateOnWorldAxis(upAxis, Math.PI/12)
        // console.log(cubes.active.rotation)
        /*

        const pivot = new Object3D()
        cubes.forEach(cube => pivot.attach(cube))
        pivot.rotateOnAxis(upAxis, Math.PI/3)

        */
        invalidate()
    }

    function applyFaceRotation(face: Face) {
        const facePieces = getFacePieces(pieces, face)
        facePieces.forEach(piece => applyRotation(piece))
    }

    // function applyRotation() {
    //     cubes.active.updateMatrix()
    //     cubes.active.children.forEach(cube => (cube as Mesh).geometry.applyMatrix4(cubes.active.matrix))
    //     cubes.active.rotation.set(0,0,0)
    //     cubes.active.updateMatrix()
    // }

    /*
    useFrame(() => {
        if(cubes.active.rotation[rotationAxis] < targetRotation) {
            cubes.active.rotation[rotationAxis] += Math.PI/100
        }
    })
    */

    // console.log("Cubes:", cubes)

    return (
        <div id="Scene">
            <div className="controls">
                <button onClick={ () => console.log(pieces) }>Log pieces</button>
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

                    <group>
                        { pieces.map((piece,i) => <primitive object={ piece } key={ i }/> )}
                    </group>

                </Canvas>
            </Suspense>
        </div>
    )
}
