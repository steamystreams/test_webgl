import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { Stats, OrbitControls } from "@react-three/drei";
import Hls from "hls.js";
import * as three from "three";
import "./styles.css";

// THANK YOU FOR TAKING A LOOK AT MUX!
// BY WAY OF THANKS, SET THIS TO `TRUE` FOR SMOOTH ELEVATOR MUSIC.
// n.b.: might play double audio in codesandbox. web browsers are weird! -Ed
const shallPlayAudio = false;
const scaleFactor = 0.5;
const url =
  "https://stream.mux.com/VvpofjgvMRxOmcvuicNE6JjaorY2XKTQej4Rs200nZ68.m3u8";

const VideoPlane = () => {
  const cube = useRef<three.Mesh>();

  const [video] = useState(() => {
    const videoElement = document.createElement("video");
    const hls = new Hls();

    videoElement.src = url;
    videoElement.crossOrigin = "Anonymous";
    videoElement.loop = true;
    videoElement.muted = !shallPlayAudio;
    videoElement.volume = 0.2;

    hls.loadSource(url);
    hls.attachMedia(videoElement);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      videoElement.play();
    });

    return videoElement;
  });

  useEffect(() => {
    return function () {
      video?.pause();
    };
  });

  useFrame(() => {
    if (cube.current) {
      cube.current.rotation.x += 0.01;
      cube.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={cube}>
      <planeBufferGeometry args={[16 * scaleFactor, 9 * scaleFactor]} />
      <meshStandardMaterial color="#ffffff">
        <videoTexture attach="map" args={[video]} />
      </meshStandardMaterial>
    </mesh>
  );
};

const Scene = () => {
  return (
    <>
      <gridHelper />
      <axesHelper />
      <pointLight intensity={1.0} position={[5, 3, 5]} />
      <VideoPlane />
    </>
  );
};

const App = () => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw"
      }}
    >
      <Canvas
        concurrent
        camera={{
          near: 0.1,
          far: 1000,
          zoom: 1
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#27202f");
        }}
      >
        <Stats />
        <OrbitControls />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <div
        style={{
          position: "absolute",
          right: "0px",
          bottom: "00px",
          background: "#ffffff",
          color: "#000000"
        }}
      >
        <img
          alt="Powered by Mux Video"
          src="https://mux.com/files/mux-video-logo-square.png"
          style={{ width: "120px" }}
        />
      </div>
    </div>
  );
};

export default App;
