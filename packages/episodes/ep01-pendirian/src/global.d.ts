// Global JSX declarations for React Three Fiber / Three.js elements
// This enables JSX elements like <mesh>, <boxGeometry>, <meshStandardMaterial>, etc.

import '@react-three/fiber';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      // Three.js objects
      group: any;
      mesh: any;
      instancedMesh: any;
      scene: any;
      // Geometries
      boxGeometry: any;
      sphereGeometry: any;
      planeGeometry: any;
      cylinderGeometry: any;
      coneGeometry: any;
      torusGeometry: any;
      circleGeometry: any;
      ringGeometry: any;
      // Materials
      meshBasicMaterial: any;
      meshStandardMaterial: any;
      meshPhysicalMaterial: any;
      meshPhongMaterial: any;
      meshLambertMaterial: any;
      meshMatcapMaterial: any;
      meshToonMaterial: any;
      lineBasicMaterial: any;
      lineDashedMaterial: any;
      pointsMaterial: any;
      spriteMaterial: any;
      shadowMaterial: any;
      // Lights
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
      spotLight: any;
      hemisphereLight: any;
      rectAreaLight: any;
      // Helpers
      gridHelper: any;
      axesHelper: any;
      polarGridHelper: any;
      // Camera
      perspectiveCamera: any;
      orthographicCamera: any;
      // Other
      primitive: any;
    }
  }
}

// Extend @react-three/fiber's Canvas props
declare module '@react-three/fiber' {
  interface CanvasProps {
    children?: React.ReactNode;
  }
}