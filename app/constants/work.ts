import * as THREE from "three";
import { WorkTimelinePoint } from "../types";

export const WORK_TIMELINE: WorkTimelinePoint[] = [
  {
    point: new THREE.Vector3(0, 0, 0),
    year: '2022',
    title: 'PT. Kimia Farma Diagnostika',
    subtitle: 'Web Developer (Internship)',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-4, -4, -3),
    year: '2024 - 2025',
    title: 'PT. Kodeintekno Cipta Solusi',
    subtitle: 'Fullstack Developer (Freelance)',
    position: 'left',
  },
  {
    point: new THREE.Vector3(-3, -1, -6),
    year: '2025',
    title: 'PT. Aneka Search Indonesia (Peepl)',
    subtitle: 'IT Programmer (Internship)',
    position: 'left',
  },
  {
    point: new THREE.Vector3(0, -1, -10),
    year: '2025 - Present',
    title: 'PT. Aneka Search Indonesia (Peepl)',
    subtitle: 'Fullstack Developer (Contract)',
    position: 'left',
  }
]