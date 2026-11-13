import { useSphere } from "@react-three/cannon";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Mesh, Object3D, Vector3 } from "three";
import { useKeyboard } from "../../hooks/useKeyboard";

const CARACTER_SPEED = 5;
const JUMP_SPEED = 5;
// Contact normals with a vertical component above this count as "standing on" a body.
const MIN_GROUND_NORMAL_Y = 0.5;

const Player = () => {
  const { moveBackward, moveForward, moveLeft, moveRight, jump } =
    useKeyboard();
  const { camera } = useThree();

  // Cannon only reports "collide" on the first contact, so supports are tracked
  // from that event until the matching "collideEnd".
  const supports = useRef(new Set<Object3D>());
  const [ref, api] = useSphere<Mesh>(() => ({
    mass: 1,
    type: "Dynamic",
    position: [0, 0.5, 0],
    onCollide: ({ body, contact }) => {
      if (contact.contactNormal[1] > MIN_GROUND_NORMAL_Y) {
        supports.current.add(body);
      }
    },
    onCollideEnd: ({ body }) => {
      supports.current.delete(body);
    },
  }));

  const pos = useRef([0, 0, 0]);
  useEffect(() => api.position.subscribe((p) => (pos.current = p)), [api.position]);

  const vel = useRef([0, 0, 0]);
  useEffect(() => api.velocity.subscribe((v) => (vel.current = v)), [api.velocity]);

  // A removed cube's "collideEnd" arrives after its ref is gone and can't be matched,
  // so supports whose mesh left the scene are pruned here.
  const isGrounded = () => {
    for (const support of supports.current) {
      if (support.parent) return true;
      supports.current.delete(support);
    }
    return false;
  };

  useFrame(() => {
    camera.position.set(pos.current[0], pos.current[1], pos.current[2]);

    const direction = new Vector3();
    const frontVector = new Vector3(
      0,
      0,
      (moveForward ? 1 : 0) - (moveBackward ? 1 : 0)
    );

    const sideVector = new Vector3(
      (moveRight ? 1 : 0) - (moveLeft ? 1 : 0),
      0,
      0
    );
    direction
      .subVectors(sideVector, frontVector)
      .normalize()
      .multiplyScalar(CARACTER_SPEED)
      .applyEuler(camera.rotation);

    api.velocity.set(direction.x, vel.current[1], direction.z);

    if (jump && isGrounded()) {
      api.velocity.set(vel.current[0], JUMP_SPEED, vel.current[2]);
    }
  });

  return <mesh ref={ref} />;
};

export default Player;
