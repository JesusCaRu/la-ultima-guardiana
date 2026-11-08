<div align="center">

# ⚔️ La Última Guardiana

### Dos espadas. Un juramento. Un nuevo comienzo.

Una leyenda interactiva de fantasía contada con **scroll, Three.js y modelos creados en Blender**.

![Three.js](https://img.shields.io/badge/Three.js-3D-black?logo=threedotjs&logoColor=white)
![Blender](https://img.shields.io/badge/Blender-modelado-E87D0D?logo=blender&logoColor=white)
![WebGL](https://img.shields.io/badge/WebGL-experiencia%203D-8f3d32?logo=webgl&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES%20modules-d2b469?logo=javascript&logoColor=black)

</div>

---

## La historia

En un reino olvidado, dos hojas nacidas del mismo fuego toman caminos opuestos. La Guardiana conserva un juramento de protección; la Carmesí lleva el peso de una pérdida. Su encuentro termina con ambas espadas rotas, pero de sus luces nace una tercera: **la Renacida**.

Desplázate para descubrir cada capítulo. La posición de las espadas, los choques, las chispas y la separación de sus piezas responden al recorrido. En el desenlace aparece la nueva espada, acompañada por una melodía original que se puede activar desde la página.

## Qué encontrarás

- **Tres espadas 3D** con grabados, gemas y detalles metálicos, modeladas en Blender y exportadas como GLB.
- **Narrativa por capítulos**, con movimientos y transiciones ligados al scroll.
- **Duelo con chispas y restricciones de separación** entre los modelos. La coreografía es una aproximación geométrica, no una simulación física completa.
- **Fracturas preparadas en Blender** a partir de los modelos originales y un final animado de renacimiento.
- **Música opcional** generada con Web Audio: actívala con el botón de la página para escucharla al llegar al final.
- Diseño adaptable y respeto a la preferencia del sistema de reducir movimiento.

## Ejecutarlo en local

Necesitas [Node.js](https://nodejs.org/) e internet para cargar Three.js y las fuentes desde sus proveedores externos.

```bash
git clone https://github.com/JesusCaRu/la-ultima-guardiana.git
cd la-ultima-guardiana
node servidor.cjs
```

Abre [http://127.0.0.1:4173](http://127.0.0.1:4173). En Windows también puedes abrir `abrir-web.cmd` y dejar su ventana abierta mientras navegas.

> La web necesita servirse por HTTP para cargar correctamente los módulos y los modelos; abrir `index.html` directamente no es suficiente.

### Ejecutarlo con Docker

Con Docker y Docker Compose instalados, desde la carpeta del proyecto ejecuta:

```bash
docker compose up --build -d
```

Abre [http://localhost:8080](http://localhost:8080). Para detener y retirar el contenedor:

```bash
docker compose down
```

Docker sirve la web y los modelos; el navegador sigue necesitando conexión a internet para cargar Three.js y las fuentes. Si el puerto 8080 está ocupado, cambia el primer número de `8080:4173` en `compose.yaml`.

## Estructura

```text
├── index.html                # Historia y estructura de la página
├── style.css                 # Diseño, tipografía y adaptación responsive
├── main.js                   # Escena Three.js y animación con scroll
├── music.js                  # Música opcional con Web Audio
├── espada_*.glb              # Espadas listas para la web
├── fractura_*.glb            # Piezas modeladas en Blender
├── blender/                  # Modelos y fracturas editables (.blend)
├── Dockerfile                # Imagen de ejecución
├── compose.yaml              # Arranque con Docker Compose
└── servidor.cjs              # Servidor local sin dependencias
```

## Tecnología

La página usa HTML, CSS y JavaScript sin un framework de interfaz. La escena 3D utiliza [Three.js](https://threejs.org/) y `GLTFLoader`; los modelos se han creado y preparado en [Blender](https://www.blender.org/). Las tipografías se cargan desde Google Fonts.

---

<div align="center"><em>«Cuando sus hojas se quebraron, sus luces se encontraron.»</em></div>

