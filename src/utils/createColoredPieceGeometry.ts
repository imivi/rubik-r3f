import { BoxGeometry, BufferAttribute, Color, Float32BufferAttribute, MeshBasicMaterial, MeshStandardMaterial } from "three"


type RGB = [number, number, number]

const faceColors: RGB[] = [
    [255,   0,      0], // red
    [0,     255,    0], // green
    [0,     0,      255], // blue
    [247,   206,    0], // yellow
    [247,   85,     0], // orange
    [255,   255,    255], // white
].map(([r,g,b]) => ([r/255, g/255, b/255])) // map from (0-255) to (0-1)


export function createColoredPieceGeometry() {

    const geometry = new BoxGeometry(1, 1, 1).toNonIndexed()

    // generate color data for each vertex
    const vertexCount = geometry.getAttribute("position").count

    const colors = []
    // const color = new Color()

    let currentColorIndex = 0
    let dontFlipColor = false

    for (let i = 0; i < vertexCount; i += 3) {
        // console.log(vertexPositions)

        // const vertices: BufferAttribute[] = [
        //     vertexPositions[i],
        //     vertexPositions[i+1],
        //     vertexPositions[i+2],
        // ]

        // color.set(Math.random() * 0xffffff)

        // const rgb: [number, number, number] = [0, 0, 0]
        // rgb[currentColorIndex] = 1
        const rgb = faceColors[currentColorIndex]

        if(dontFlipColor) {
            currentColorIndex += 1
            if(currentColorIndex > 5)
                currentColorIndex = 0
        }
        dontFlipColor = !dontFlipColor

        // Define the same color for each vertex of a triangle
        colors.push(...rgb)
        colors.push(...rgb)
        colors.push(...rgb)
    }

    // define the new attribute
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))

    // vertexColors must be true so vertex colors can be used in the shader
    const material = new MeshStandardMaterial({ vertexColors: true })


    return { geometry, material }

    /*
    mesh = new Mesh( geometry, material );
    scene.add( mesh );

    renderer = new WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    */
}
