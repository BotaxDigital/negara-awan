import React from 'react';
import { Canvas, useThree } from '@remotion/three';

interface CameraProps {
  position: [number, number, number];
  target: [number, number, number];
  children: React.ReactNode;
  fov?: number;
}

export const Camera: React.FC<CameraProps> = ({ position, target, children, fov = 50 }) => {
  const { camera } = useThree();
  
  // Update camera position and lookAt
  React.useEffect(() => {
    camera.position.set(...position);
    camera.lookAt(...target);
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }, [position, target, fov, camera]);

  return <Canvas>{children}</Canvas>;
};

export const useCameraControls = () => {
  const { camera } = useThree();
  
  const setPosition = (pos: [number, number, number]) => {
    camera.position.set(...pos);
  };
  
  const setTarget = (target: [number, number, number]) => {
    camera.lookAt(...target);
  };
  
  const setFov = (fov: number) => {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  };
  
  return { setPosition, setTarget, setFov };
};