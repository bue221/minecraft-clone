# Clon de Minecraft

Un clon minimalista de Minecraft que corre en el navegador, hecho con React, Three.js y física en tiempo real. Puedes recorrer el mundo en primera persona, saltar y construir o destruir bloques con distintas texturas. Lo que construyes se guarda automáticamente en el navegador.

## Características

- **Pantalla de inicio y pausa** con la lista de controles; `Esc` pausa el juego y libera el ratón.
- **Primera o tercera persona** (`V`) con el puntero bloqueado (Pointer Lock) y una mira en el centro de la pantalla. En tercera persona se ve un personaje de bloques al estilo Steve que mueve la cabeza con la mirada y balancea brazos y piernas al caminar. La cámara va sobre el hombro y se acerca si hay bloques detrás.
- **Jugador con proporciones de Minecraft**: 0.6 de ancho, 1.8 de alto y ojos a 1.62, así que cabe por huecos de un bloque. Camina a 4.3 bloques/s, corre a 5.6 y salta 1.25 bloques.
- **Física** con [cannon-es](https://github.com/pmndrs/cannon-es): gravedad, colisiones y salto solo cuando el jugador está apoyado sobre el suelo o sobre un bloque.
- **Construcción en cuadrícula** con alcance de 5 bloques: el bloque apuntado se resalta con un contorno, los bloques se colocan pegados a la cara a la que apuntas, no se pueden poner dos en la misma posición ni dentro del jugador.
- **Inventario en modo creativo** (`E`): catálogo con copias ilimitadas de cada bloque, mochila de 27 casillas y barra de 9. Clic para coger un objeto y clic en otra casilla para dejarlo o intercambiarlo.
- **Baúles**: se colocan mirando al jugador, se abren con clic derecho y guardan 27 objetos. Con `Shift` + clic derecho se pone un bloque contra el baúl. Si se rompe, se pierde su contenido.
- **Vida** de 10 corazones. Las caídas de más de 3 bloques quitan 1 punto por bloque extra, y caer por el borde del suelo (de 100×100) al vacío quita 4 puntos cada medio segundo. Te regeneras 1 punto cada 3 s si llevas 5 s sin recibir daño. Al morir aparece una pantalla con la causa y un botón para reaparecer sobre el bloque más alto del punto de aparición.
- **Pausa real**: con el menú abierto o tras morir, la física y los temporizadores de vida se detienen.
- **5 texturas de bloque**: tierra, césped, vidrio, madera y tronco, con filtrado *nearest* para mantener el estilo pixelado.
- **Guardado automático** del mundo en `localStorage`, con validación de los datos guardados al cargarlos.
- **Cielo y luz ambiental** con `@react-three/drei`.

## Controles

| Acción | Tecla / ratón |
| --- | --- |
| Empezar o volver a jugar | Botón **Jugar** / **Volver al juego** |
| Moverse | `W` `A` `S` `D` |
| Correr | `Shift` (hacia delante) |
| Saltar | `Espacio` |
| Mirar alrededor | Ratón |
| Romper un bloque | Clic izquierdo |
| Poner un bloque | Clic derecho |
| Elegir objeto de la barra | `1`-`9` o rueda del ratón |
| Abrir o cerrar el inventario | `E` (también `Esc` para cerrar) |
| Abrir un baúl | Clic derecho sobre el baúl |
| Poner un bloque junto a un baúl | `Shift` + clic derecho |
| Cambiar entre primera y tercera persona | `V` |
| Pausa (libera el ratón) | `Esc` |
| Reiniciar el mundo (pide confirmación) | Botón en el menú de pausa |

## Tecnologías

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 4](https://vitejs.dev/) como bundler y servidor de desarrollo
- [Three.js](https://threejs.org/) a través de [`@react-three/fiber`](https://docs.pmnd.rs/react-three-fiber)
- [`@react-three/drei`](https://github.com/pmndrs/drei) para el cielo y el contorno del bloque apuntado
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
├── App.tsx                 # Escena: Canvas, cielo, luces, física, barra y menú
├── main.tsx                # Punto de entrada de React
├── index.css               # Estilos del HUD, los menús y el inventario
├── components/
│   ├── BlockInteraction/   # Apuntar, contorno del bloque, romper/poner y abrir baúles
│   ├── CameraRig/          # Cámara en primera o tercera persona, con colisión y tecla V
│   ├── ChestBlock/         # Bloque de baúl (14/16 de bloque, orientado)
│   ├── Cube/               # Un bloque texturizado con colisión estática
│   ├── Cubes/              # Renderiza todos los bloques del store
│   ├── DeathScreen/        # Pantalla de muerte con la causa y botón de reaparecer
│   ├── Ground/             # Losa finita de 100×100 con física (fuera de ella está el vacío)
│   ├── HealthBar/          # Corazones de vida en el HUD
│   ├── Hotbar/             # Barra de 9 objetos: teclas 1-9 y rueda del ratón
│   ├── HurtOverlay/        # Destello rojo al recibir daño
│   ├── InventoryScreen/    # Pantalla de inventario y de baúl (tecla E)
│   ├── ItemIcon/           # Icono de un objeto (textura o dibujo del baúl)
│   ├── LookControls/       # Bloqueo del puntero y mirada con el ratón
│   ├── PauseMenu/          # Pantalla de inicio/pausa con controles y reinicio
│   ├── Player/             # Cuerpo físico del jugador, movimiento, carrera y salto
│   ├── PlayerModel/        # Personaje de bloques animado (visible en tercera persona)
│   ├── PlayerVitals/       # Daño en el vacío y regeneración de vida
│   └── RotateCubes/        # Demo de react-three-fiber (no se usa en la escena)
├── hooks/
│   ├── useHealth.ts        # Store de vida: daño, curación, muerte y reaparición
│   ├── useInventory.ts     # Store de inventario: barra, mochila, baúles y objeto en la mano
│   ├── useKeyboard.tsx     # Traduce las teclas a acciones de movimiento
│   ├── useSession.ts       # Store de sesión: jugando/en pausa, pantalla abierta, cámara
│   └── useStore.tsx        # Store del mundo: bloques y acciones
├── images/
│   ├── images.ts           # Importa las imágenes de las texturas
│   └── textures.ts         # Carga las texturas, nombres y tipos de bloque
├── inventory/
│   ├── containers.ts       # Contenedores de objetos y reglas de coger/dejar/intercambiar
│   ├── inventoryStorage.ts # Guardado y carga validados del inventario
│   └── items.ts            # Catálogo de objetos (bloques texturizados y baúl)
├── player/
│   ├── health.ts           # Reglas de vida: daño por caída, vacío y regeneración
│   ├── playerState.ts      # Posición y orientación del jugador, compartidas por frame
│   └── spawn.ts            # Punto de aparición seguro sobre los bloques
├── storage/
│   └── localJson.ts        # Lectura y escritura de JSON en localStorage con manejo de errores
└── world/
    ├── blockSurface.ts     # Marca de superficies sólidas y raycast filtrado sobre ellas
    ├── cube.ts             # Tipo Cube y helpers de posición en la cuadrícula
    └── worldStorage.ts     # Guardado y carga versionados en localStorage
```

## Detalles de implementación

### Estado del mundo

`useStore` (Zustand) es la única fuente de verdad sobre los bloques. `addCube` redondea las coordenadas a la cuadrícula, descarta posiciones no finitas y no hace nada si la celda ya está ocupada. Una suscripción al store guarda el mundo cada vez que cambia la lista de bloques.

### Persistencia

El mundo se guarda en `localStorage` bajo la clave `minecraft-clone:world` con este formato. `facing` (de 0 a 3 cuartos de vuelta) solo aparece en los baúles:

```json
{
  "version": 2,
  "cubes": [
    { "id": "abc123", "pos": [0, 0, 0], "type": "wood" },
    { "id": "def456", "pos": [1, 0, 0], "type": "chest", "facing": 2 }
  ]
}
```

El inventario se guarda bajo `minecraft-clone:inventory`. Cada contenedor es una lista de objetos o `null`: `hotbar` (9), `backpack` (27) y `chest:<id del bloque>` (27). También se guarda `selectedSlot`, la casilla elegida en la barra.

Al cargar se aplican estas reglas:

- Los mundos de la versión 1 (con `texture` en vez de `type`) se migran solos.
- Si el JSON está corrupto o la versión no es compatible, se avisa en la consola y se usan los valores por defecto.
- Los bloques inválidos o duplicados se descartan uno a uno, así que una entrada rota no borra el resto del mundo. Los contenedores inválidos vuelven a su valor por defecto, y se borran los baúles que ya no existen en el mundo.
- Si falla el guardado (por ejemplo, porque no queda cuota), se registra el error y el juego sigue funcionando.

### Controles y cámara

`LookControls` gestiona el bloqueo del puntero y convierte el movimiento del ratón en la orientación del jugador (`yaw` y `pitch` en `playerState`). La cámara solo la lee (`CameraRig`), así que la dirección en la que mira el jugador no depende de dónde esté la cámara. Si el navegador rechaza el bloqueo del puntero, el menú muestra el motivo.

En tercera persona, `CameraRig` coloca la cámara 4 bloques detrás de los ojos y 0.6 a la derecha, para que la cabeza no tape la mira. Lanza un rayo desde los ojos hasta esa posición y, si choca con un bloque, acerca la cámara justo delante del choque.

### Apuntar, romper y poner

`BlockInteraction` lanza cada frame un rayo desde el centro de la cámara, así la mira es exacta en primera y en tercera persona. El alcance de 5 bloques se mide desde los ojos del jugador, y se ignora lo que queda entre la cámara y el jugador. Solo cuenta lo que tiene `userData.blockSurface` (el suelo y los cubos). La celda del bloque apuntado es el punto de impacto menos media unidad a lo largo de la normal de la cara, y la celda donde se pone el bloque nuevo es ese punto más media unidad. Antes de poner un bloque se comprueba que no se solape con la caja del jugador.

`@react-three/cannon` sobrescribe el `userData` de la malla con el de las propiedades del cuerpo físico, por eso los cubos y el suelo lo declaran ahí.

### Movimiento

La velocidad horizontal del jugador se fija cada frame según el `yaw`, sin el `pitch`, así que mirar al suelo no frena. Por eso el material de contacto por defecto no tiene rozamiento ni rebote: solo frenaría al jugador y lo haría rebotar al aterrizar. El cuerpo son tres esferas apiladas con rotación bloqueada, que se comportan como una cápsula.

### Vida

`Player` guarda la altura máxima de los pies desde que deja de tocar el suelo y, al aterrizar, aplica `fallDamage(caída)`: 1 punto por bloque más allá de 3, con una pequeña tolerancia porque la física nunca aterriza en números exactos. `PlayerVitals` aplica el daño del vacío por debajo de \(y = -20\) y la regeneración, con temporizadores que solo avanzan mientras se juega. Al reaparecer, `useHealth` incrementa `lifeId` y `Player` teletransporta el cuerpo físico al punto que calcula `findSpawnFeet`.

### Salto

Cannon solo emite `collide` en el primer contacto. Por eso `Player` registra los cuerpos sobre los que se apoya (normal de contacto con componente vertical mayor que 0.5) desde `collide` hasta `collideEnd`. También descarta los bloques que ya se quitaron de la escena, para no poder saltar en el aire después de borrar el bloque que se tenía debajo.
