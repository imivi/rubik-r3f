import "./Scene.scss"
import { Canvas, invalidate } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Suspense, useState } from "react"
import { Vector3 } from "three"
import { type Piece, createPieces } from "../utils/createPieces"
import { Face, faces, getAxisOfRotation, getFacePieces, getWorldPosition } from "../utils/getFacePieces"
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

        /*
        console.log("Face piece positions:")
        facePieces.forEach(piece => {
            const pos = piece.children[0].position.clone()
            pos.applyQuaternion(piece.quaternion)
            console.log(pos)
        })
        */

        // const positions = facePieces.map(piece => piece.children[0].position)
        // console.log(positions)
        // console.log(positions.map(pos => pos.clone().applyQuaternion()))

        facePieces.forEach(piece => piece.rotation[rotationAxis] += (clockwise ? -1 : 1) * Math.PI/4)

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
        invalidate()
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

                    <group onClick={ (e) => console.log(e.intersections) }>
                        { pieces.map((piece,i) => <primitive object={ piece } key={ i }/> )}
                    </group>
                    

                </Canvas>
            </Suspense>
        </div>
    )
}
