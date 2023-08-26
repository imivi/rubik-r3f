import "./Scene.scss"
import { Canvas, invalidate, useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { Suspense, useEffect, useRef, useState } from "react"
import { Mesh, BoxGeometry, MeshNormalMaterial, Vector3, Group, Object3D } from "three"

// import { Subcube } from "./Subcube"


function getCubePositions() {
    const positions: Vector3[] = []
    
    for(let layer=0; layer<3; layer++) {
        for(let row=0; row<3; row++) {
            for(let col=0; col<3; col++) {
                positions.push(new Vector3(layer-1, row-1, col-1).multiplyScalar(1.01))
            }
        }
    }
    return positions
}

// const positions = getCubePositions()



function createCubes(): Mesh[] {
    const cubeGeometry = new BoxGeometry(1,1,1)
    const cubeMaterial = new MeshNormalMaterial()
    
    const positions = getCubePositions()

    const cubes = positions.map(position => {
        const cube = new Mesh(cubeGeometry, cubeMaterial)
        const { x, y, z } = position
        cube.position.set(x,y,z)
        return cube
    })

    return cubes
}

type Cube = Mesh

// const cubes = createCubes()

type Cubes = {
    active: Group
    inactive: Group
}

const cubes: Cubes = {
    active: new Group(),
    inactive: new Group(),
}
cubes.inactive.add(...createCubes())

const upAxis = new Vector3(0,1,0)

export function Scene() {

    const [rotationAxis, setRotationAxis] = useState<"x"|"y"|"z">("y")
    const [targetRotation, setTargetRotation] = useState(0)
    
    // console.log(positions)

    // const [cubes] = useState(createCubes())

    /*
    useEffect(() => {
        cubesRef.current = createCubes()
        console.log("Created cubes:", cubesRef.current)
        setCount((count) => count+1)
    }, [])
    */

    function getTopLayerCubes() {
        const allCubes = [...cubes.active.children, ...cubes.inactive.children]
        const active = allCubes.filter(cube => cube.position.y > 0.5)
        const inactive = allCubes.filter(cube => cube.position.y <= 0.5)
        cubes.active.add(...active)
        cubes.inactive.add(...inactive)
        // return cubes.active
    }

    function rotateTopLayer() {
        getTopLayerCubes()
        
        // console.log({ cubes })

        setRotationAxis("y")
        // setTargetRotation(Math.PI/2)

        cubes.active.rotation[rotationAxis] += Math.PI/12


        // cubes.active.rotateOnWorldAxis(upAxis, Math.PI/12)
        // console.log(cubes.active.rotation)
        /*

        const pivot = new Object3D()
        cubes.forEach(cube => pivot.attach(cube))
        pivot.rotateOnAxis(upAxis, Math.PI/3)

        */
        invalidate()
    }

    function applyRotation() {
        cubes.active.updateMatrix()
        cubes.active.children.forEach(cube => (cube as Mesh).geometry.applyMatrix4(cubes.active.matrix))
        cubes.active.rotation.set(0,0,0)
        cubes.active.updateMatrix()
    }

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
                <button onClick={ () => console.log(cubes) }>Log cubes</button>
                <button onClick={ rotateTopLayer }>Rotate top layer</button>
                <button onClick={ applyRotation }>Apply rotation</button>
            </div>
            <Suspense fallback={ null }>
                <Canvas frameloop="demand">
                    <OrbitControls/>
                    <PerspectiveCamera position={ new Vector3(0,10,10) } makeDefault/>

                    <primitive object={ cubes.active }/>
                    <primitive object={ cubes.inactive }/>
                    {/* <group>
                        { cubes.active.map((cube,i) => <primitive object={ cube } key={ i }/>) }
                    </group>
                    <group>
                        { cubes.inactive.map((cube,i) => <primitive object={ cube } key={ i }/>) }
                    </group> */}
                </Canvas>
            </Suspense>
        </div>
    )
}