import React, { useState, useRef, useEffect} from "react"
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { useLoader } from 'react-three-fiber'
import { useSpring, animated as a } from 'react-spring/three'
import { MeshStandardMaterial } from "three"


export default ({setShowLoader}) => {
    const group = useRef()
    const outerGroup = useRef()
    const [hovered, setHovered ] = useState(false);
    useEffect(() => void (document.body.style.cursor = hovered ? 'pointer' : 'auto'), [hovered]);

    const dark = new THREE.Color('#8D7471');
    const white = new THREE.Color('#fff');
    // const dark = new THREE.Color("rgb(255, 0, 0)");
    // const white = new THREE.Color("rgb(255, 255, 255)");

    const props = useSpring({
        scale: hovered ? [1.5, 1.5, 1.5] : [1, 1, 1],
        color: hovered ? "hotpink" : "gray"
      })


    const {nodes, materials} = useLoader(GLTFLoader, '/newdonut.gltf', loader=>{
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco-gltf/')
        loader.setDRACOLoader(dracoLoader)
      })

        // materials['Material.001'].color = new THREE.Color('#fff');


        //Start CSS
    React.useEffect(() => {
        setShowLoader(false)
    }, []);


    return(
       
       <a.group
        ref={outerGroup}
        displose={null}
        >
            <a.group
                ref={group}
                dispose={null}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                scale={props.scale}>
                    <a.mesh 
                        material={materials['Material.001']} 
                        geometry={nodes.Icing.geometry} 
                        position={[0, 0, 0]}
                         >
                            <meshStandardMaterial
                              attach = "material"
                              color={hovered ? 'hotpink' : 'orange'}
                              />
                    </a.mesh>
                    <mesh material={materials['Material.002']} geometry={nodes.Donut.geometry} position={[0, 0, 0]} />
            </a.group>
        </a.group>
     
    )
  
}