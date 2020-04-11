import React, { useState,  Suspense, useRef, useEffect} from "react"
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { Transition, animated } from 'react-spring/renderprops'
import { Canvas, extend, useThree, useFrame, useLoader } from 'react-three-fiber'
import { useSpring, a } from 'react-spring/three'
import * as CANNON from 'cannon';

import './style.scss'

extend({ OrbitControls })

const Box = () => {
  const [hovered, setHovered ] = useState(false)
  const [active, setActive] = useState(false)
  const props = useSpring({
   scale: active ? [1.5, 1.5, 1.5]: [1, 1, 1],
   color: hovered ? "hotpink" : "gray"
  })
  
  console.log('Box');
  // useFrame(() => {
  //   meshRef.current.rotation.y += 0.01
  // })

  return(
    <a.mesh
      onPointerOver={()=> setHovered(true)} 
      onPointerOut={()=> setHovered(false)}
      onClick={()=> setActive(!active)}
      scale={props.scale}
      castShadow
      >
      
      <boxBufferGeometry 
        attach="geometry"
        args={[1, 1, 1]}
      />
      <a.meshPhysicalMaterial
        attach="material"
        color={props.color}
      />
    </a.mesh>
  )
}

export default () => {
  const [loadUI, setLoadUI] = React.useState(true);
  const [modelLoaded, setModelLoaded] = React.useState(false);

  React.useEffect(() => {
    if(modelLoaded){
      setTimeout(() => {
        setLoadUI(false)
        console.log('Hide LoadUI')
      }, 2000)
    }
  }, [modelLoaded])

  const Controls = () => {
    const orbitRef = useRef();
    const { gl, camera } = useThree();
  
    useFrame(()=>{
      orbitRef.current.update()
    })
  
    return(
      <orbitControls
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
        enableZoom={false}
        args={[camera, gl.domElement]}
        ref={orbitRef}
      />
    )
  }

  const Asset = ({url}) => {
    if(!modelLoaded){

      const model = useLoader(GLTFLoader, url, loader=>{
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/draco-gltf/')
        loader.setDRACOLoader(dracoLoader)
      })
    
      console.log('Asset Loaded', model)
      React.useEffect(() => {
        setModelLoaded(true);
      }, []);

      return <primitive object={model.scene} dispose={null} />

    }

  
    
  }

  const Loading = (props) =>{
    return(
      <animated.div  style={props.style} className="Loading__spinner" >
           <h1>LOADING</h1>
       </animated.div>
    )
  }
  


  return ( 
  < div className="App">
   
    <Transition
          items={loadUI}
          from={{ opacity: 1}}
          enter={{ opacity: 1}}
          leave={{ opacity: 0 }}>
          {loadUI =>
           loadUI &&  (props => <Loading style={props}/>) }
    </Transition>

    <div className="App__canvas">
      <Canvas camera={{ position: [0, 0.25, 0.2] }} 
              onCreated={({ gl }) => {
                gl.shadowMap.enabled= true
                gl.shadowMap.type = THREE.PCFSoftShadowMap
      }}>
        <ambientLight/>
        <spotLight position={[15, 20, 5]} penumbra={1} castShadow />
        <fog attach="fog" args={["black", 10, 25]}/>
        <Controls />
        <Suspense fallback={null}>
          <Asset 
            url="/newdonut.gltf"
          />
        </Suspense>
      </Canvas>
    </div>

  </div>
)
}
