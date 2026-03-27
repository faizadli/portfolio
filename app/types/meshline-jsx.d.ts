import type { ThreeElement } from "@react-three/fiber";
import type { MeshLineGeometry, MeshLineMaterial } from "meshline";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
      meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
    }
  }
}
