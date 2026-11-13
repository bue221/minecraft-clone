# Clon de Minecraft

Un clon minimalista de Minecraft que corre en el navegador, hecho con React, Three.js y física en tiempo real. Puedes recorrer el mundo en primera persona, saltar y construir o destruir bloques con distintas texturas. Lo que construyes se guarda automáticamente en el navegador.

## Características

- **Vista en primera persona** con el puntero bloqueado (Pointer Lock) y una mira en el centro de la pantalla.
- **Física** con [cannon-es](https://github.com/pmndrs/cannon-es): gravedad, colisiones y salto solo cuando el jugador está apoyado sobre el suelo o sobre un bloque.
- **Construcción en cuadrícula**: los bloques se colocan pegados a la cara a la que apuntas, y no se pueden poner dos bloques en la misma posición.
- **5 texturas de bloque**: tierra, césped, vidrio, madera y tronco, con filtrado *nearest* para mantener el estilo pixelado.
- **Guardado automático** del mundo en `localStorage`, con validación de los datos guardados al cargarlos.
- **Cielo y luz ambiental** con `@react-three/drei`.

## Controles

| Acción | Tecla / ratón |
| --- | --- |
| Activar la vista (bloquear el puntero) | Clic sobre la escena |
| Moverse | `W` `A` `S` `D` |
| Saltar | `Espacio` |
| Mirar alrededor | Ratón |
| Poner un bloque | Clic |
| Quitar un bloque | `Alt` + clic |
| Elegir textura | `1` tierra · `2` césped · `3` vidrio · `4` madera · `5` tronco |
| Reiniciar el mundo (pide confirmación) | `R` |
| Liberar el puntero | `Esc` |

## Tecnologías

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 4](https://vitejs.dev/) como bundler y servidor de desarrollo
- [Three.js](https://threejs.org/) a través de [`@react-three/fiber`](https://docs.pmnd.rs/react-three-fiber)
- [`@react-three/drei`](https://github.com/pmndrs/drei) para el cielo y los controles en primera persona
- [`@react-three/cannon`](https://github.com/pmndrs/use-cannon) para la física
- [Zustand](https://github.com/pmndrs/zustand) para el estado global del mundo
- [nanoid](https://github.com/ai/nanoid) para los IDs de los bloques

## Requisitos

- Node.js 18 o superior
- npm o Yarn (el repositorio incluye ambos lockfiles)

## Instalación y uso

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (http://localhost:5173)
npm run dev

# Chequeo de tipos y build de producción en dist/
npm run build

# Servir el build localmente
npm run preview
```

Con Yarn, los equivalentes son `yarn`, `yarn dev`, `yarn build` y `yarn preview`.

## Estructura del proyecto

```
src/
├── App.tsx                 # Escena: Canvas, cielo, luces, física y HUD
├── main.tsx                # Punto de entrada de React
├── index.css               # Estilos de la mira, el selector de texturas y el HUD
├── components/
│   ├── Cube/               # Un bloque: colisión estática, hover, poner/quitar
│   ├── Cubes/              # Renderiza todos los bloques del store
│   ├── FVP/                # Controles en primera persona y raycast desde la mira
│   ├── Ground/             # Suelo de 100×100 con física; clic para poner bloques
│   ├── Hud/                # Ayuda de controles y reinicio del mundo con R
│   ├── Player/             # Esfera física del jugador, movimiento y salto
│   ├── TextureSelector/    # Selector de texturas (aparece 1 s al cambiar)
│   └── RotateCubes/        # Demo de react-three-fiber (no se usa en la escena)
├── hooks/
│   ├── useKeyboard.tsx     # Traduce las teclas a acciones del juego
│   └── useStore.tsx        # Store de Zustand: bloques, textura activa, acciones
├── images/
│   ├── images.ts           # Importa las imágenes de las texturas
│   └── textures.ts         # Carga las texturas de Three.js y define los tipos
└── world/
    ├── cube.ts             # Tipo Cube y helpers de posición en la cuadrícula
    └── worldStorage.ts     # Guardado y carga versionados en localStorage
```

## Detalles de implementación

### Estado del mundo

`useStore` (Zustand) es la única fuente de verdad sobre los bloques. `addCube` redondea las coordenadas a la cuadrícula, descarta posiciones no finitas y no hace nada si la celda ya está ocupada. Una suscripción al store guarda el mundo cada vez que cambia la lista de bloques.

### Persistencia

El mundo se guarda en `localStorage` bajo la clave `minecraft-clone:world` con este formato:

```json
{
  "version": 1,
  "cubes": [{ "id": "abc123", "pos": [0, 0, 0], "texture": "wood" }]
}
```

Al cargar se aplican estas reglas:

- Si el JSON está corrupto o la versión no es compatible, se avisa en la consola y el mundo arranca vacío.
- Los bloques inválidos o duplicados se descartan uno a uno, así que una entrada rota no borra el resto del mundo.
- Si falla el guardado (por ejemplo, porque no queda cuota), se registra el error y el juego sigue funcionando.

### Raycast desde la mira

Mientras el puntero está bloqueado, el navegador sigue reportando la posición del ratón en el momento del bloqueo. Para que los clics apunten a lo que está bajo la mira, `crosshairEvents` sustituye el cálculo de eventos de `@react-three/fiber` y lanza el rayo siempre desde el centro de la pantalla.

### Salto

Cannon solo emite `collide` en el primer contacto. Por eso `Player` registra los cuerpos sobre los que se apoya (normal de contacto con componente vertical mayor que 0.5) desde `collide` hasta `collideEnd`. También descarta los bloques que ya se quitaron de la escena, para no poder saltar en el aire después de borrar el bloque que se tenía debajo.
