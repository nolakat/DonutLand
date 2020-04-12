import React, { useState,  Suspense, useRef, useEffect} from "react"
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { useLoader } from 'react-three-fiber'
import { useSpring, animated as a } from 'react-spring/three'


export default ({setModelLoaded}) => {
    const group = useRef();
    const outerGroup = useRef();

    const Asset = () => {
        const {nodes, materials} = useLoader(GLTFLoader, '/newdonut.gltf', loader=>{
          const dracoLoader = new DRACOLoader()
          dracoLoader.setDecoderPath('/draco-gltf/')
          loader.setDRACOLoader(dracoLoader)
          console.log('nodes', nodes);
          return nodes
        })
      }

        //Start CSS
    React.useEffect(() => {
    setModelLoaded(true);
    }, []);

    

    return(
       <a.group
        ref={outerGroup}
        displose={null}
        >
            <a.group
                ref={group}
                dispose={null}>
    
            </a.group>
        </a.group>
    )
  
}