import React, { useState,  Suspense, useRef, useEffect} from "react"
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { Canvas, extend, useThree, useFrame, useLoader } from 'react-three-fiber'
import { useSpring, a } from 'react-spring/three'
import Loading from './components/Loading';

import './style.css'

extend({ OrbitControls })

const SpaceShip = () =>{
  const [model, setModel] = useState();
  console.log('model', model);
  useEffect(() => {
    new GLTFLoader().load('/scene.gltf', setModel);
  })
  
  return model ? <primitive object={model.scene} /> : null
}


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
      args={[camera, gl.domElement]}
      ref={orbitRef}
    />
  )
}

const Plane = () => (
  <mesh rotation={[-Math.PI/2 , 0 , 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeBufferGeometry 
        attach="geometry"
        args={[100, 100]}
      />
      <meshPhysicalMaterial
        attach="material"
        color="white"
      />
  </mesh>
)

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

const Donut = () =>{ 
  const [modelLoaded, setModelLoaded] = React.useState(false);
  const [model, setModel] = useState();

  useEffect(() => {
    new GLTFLoader().load('/bestdonut.gltf', setModel);
  })

  console.log('donut', model);
  return model ? <primitive object={model.scene} /> : <Loading /> 


}

const Asset = ({url}) => {
  const gltf = useLoader(GLTFLoader, url, loader=>{
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco-gltf/')
    loader.setDRACOLoader(dracoLoader)
  })
  console.log('Asset Loaded', gltf)
  React.useEffect(() => {
   
}, []);
  return <primitive object={gltf.scene} dispose={null} />
}


export default () => {

  const [modelLoaded, setModelLoaded] = React.useState(false);
  const [loadUI, setLoadUI] = React.useState(false);

  React.useEffect(() => {
    if(modelLoaded){
      setTimeout(() => {
        setModelLoaded(true)
      }, 2000)
    }
  }, [modelLoaded])

  
  return ( 
  <>
  <h1>HELLO YOU</h1>
  <Canvas camera={{ position: [0, 0.25, 0.2] }} 
          onCreated={({ gl }) => {
            gl.shadowMap.enabled= true
            gl.shadowMap.type = THREE.PCFSoftShadowMap
  }}>
    <ambientLight/>
    <spotLight position={[15, 20, 5]} penumbra={1} castShadow />
    <fog attach="fog" args={["black", 10, 25]}/>
    <Controls />
    {/* <Box /> */}
    {/* <Plane />  */}
    {/* <Donut /> */}
    {/* <SpaceShip /> */}
    <Suspense fallback={<Box />}>
      <Asset 
        url="/newdonut.gltf"
       />
    </Suspense>
  </Canvas>
  </>
)
}
