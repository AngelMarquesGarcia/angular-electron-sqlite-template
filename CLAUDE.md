# Angular + Electron + SQLite Template

Template funcional de punto de partida para proyectos desktop con Angular como renderer, Electron como main process, y SQLite como base de datos local. Incluye lógica mínima de ejemplo (operaciones matemáticas y contador de palabras) que demuestra la comunicación frontend↔backend y la persistencia en base de datos.

---

## Arquitectura general

El proyecto sigue una estructura de **tres mini-proyectos**: un proyecto padre que orquesta dos hijos.

```
from-scratch-angular-electron/
├── angular/          # Proyecto hijo: frontend (renderer process)
├── electron/         # Proyecto hijo: backend (main process)
├── shared/           # Tipos e interfaces compartidos entre ambos hijos
├── dist/             # Todo el output de compilación y packaging
├── package.json      # Proyecto padre: scripts de orquestación y electron-builder
└── electron-builder.yml
```

Cada hijo tiene su propio `package.json` y puede ejecutarse de forma independiente. El proyecto padre no contiene código fuente propio — solo scripts y config de build.

---

## Estructura detallada

### `angular/` — Frontend

```
angular/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── models/
│   │   │   └── services/
│   │   │       └── electron.service.ts   # Wrapper RxJS sobre la IPC API
│   │   ├── features/
│   │   │   ├── operations/               # Calculadora (ejemplo IPC + DB)
│   │   │   └── sentences/                # Contador de palabras (ejemplo IPC + DB)
│   │   ├── services/                     # Reservado para servicios comunes futuros
│   │   └── shared/
│   │       ├── components/
│   │       ├── directives/
│   │       └── pipes/
│   └── environments/
│       ├── environment.ts                # LOCAL
│       ├── environment.dev.ts
│       └── environment.prod.ts
├── angular.json                          # outputPath: ../dist/renderer
├── package.json
├── tsconfig.json                         # Base (IDE + herencia)
├── tsconfig.app.json                     # Para ng build (extiende base)
└── tsconfig.spec.json                    # Para ng test (extiende base)
```

Angular 19, standalone components (sin NgModule). El output de build va a `dist/renderer/`.

### `electron/` — Backend

```
electron/
├── ipc/
│   ├── channels.ts                       # Constantes de nombres de canal IPC
│   ├── api.handler.ts
│   ├── operations.handler.ts
│   └── sentences.handler.ts
├── services/
│   ├── database.service.ts               # SQLite con better-sqlite3
│   ├── operations.service.ts
│   ├── sentences.service.ts
│   └── api.service.ts
├── main.ts                               # Entry point del main process
├── preload.ts                            # Expone la API al renderer vía contextBridge
├── esbuild.config.mjs                    # Config de bundling (main + preload → dist/main/)
├── tsconfig.json                         # Solo type-check (noEmit: true)
└── package.json
```

El output de esbuild va a `dist/main/` (dos archivos: `main.js` y `preload.js`).

### `shared/` — Tipos compartidos

```
shared/
├── types.ts       # operation, sentence, operator
└── interfaces.ts  # api, ops, sents (contratos de la IPC API)
```

Importado tanto por el frontend (`electron.service.ts`) como por el backend (`database.service.ts`, handlers).

### `dist/` — Output (gitignored)

```
dist/
├── main/          # main.js + preload.js (esbuild)
├── renderer/      # App Angular compilada (ng build)
└── build/         # App empaquetada por electron-builder
```

---

## Flujo IPC

```
Angular Component
    ↓
ElectronService (RxJS wrapper sobre Promises)
    ↓
window.api / window.ops / window.sents  (contextBridge)
    ↓
ipcRenderer.invoke(Channels.X)
    ↓
ipcMain.handle(Channels.X)  →  Handler (electron/ipc/)
    ↓
Service (electron/services/)
    ↓
DatabaseService / lógica de negocio
    ↓
SQLite (better-sqlite3)
```

El preload script actúa como capa de seguridad: expone únicamente las funciones declaradas explícitamente, sin acceso directo a Node.js desde el renderer.

---

## Scripts principales

### Desde la raíz (desarrollo)

| Script | Qué hace |
|---|---|
| `npm start` | Compila electron (esbuild) y arranca angular + electron en paralelo |
| `npm run compile` | Compila angular (dev) + electron |
| `npm run compile:angular` | Solo compila angular en modo dev |
| `npm run compile:electron` | Solo compila electron con esbuild |

### Desde `electron/`

| Script | Qué hace |
|---|---|
| `npm run build` | esbuild (one-shot) |
| `npm run build:watch` | esbuild en modo watch |
| `npm run type-check` | `tsc --noEmit` (verificación de tipos sin emitir) |
| `npm run start:serve` | `electron . --serve` (carga desde localhost:4200) |

### Desde `angular/`

| Script | Qué hace |
|---|---|
| `npm start` | `ng serve` en :4200 |
| `npm run build:dev` | Build de desarrollo → `dist/renderer/` |
| `npm run build:prod` | Build de producción → `dist/renderer/` |

---

## Configuraciones clave

### esbuild (`electron/esbuild.config.mjs`)
Bundlea `main.ts` y `preload.ts` por separado. Externos: `electron` y `better-sqlite3` (módulo nativo, no se puede bundlear). Target: `node22` (Node.js embebido en Electron 40). Soporta modo `--watch`.

### electron-builder (`electron-builder.yml`)
Empaqueta desde la raíz del proyecto. Incluye `dist/main/**` y `dist/renderer/**`. Output en `dist/build/`. Targets Windows: NSIS + ZIP.

### `better-sqlite3`
Módulo nativo que requiere ser recompilado para la versión de Node embebida en Electron. Tras `npm install` en la raíz, ejecutar:
```bash
npx @electron/rebuild --version 40.0.0 --force
```

---

## Tecnologías

| Capa | Tecnología | Versión |
|---|---|---|
| Frontend | Angular | 19 |
| Desktop | Electron | 40 |
| Base de datos | better-sqlite3 | 12.x |
| Bundler (electron) | esbuild | 0.25.x |
| Packaging | electron-builder | 26.x |
| Lenguaje | TypeScript | 5.x |

---

## Historial de cambios

### 30/04/2026
**Punto de partida:** template funcional pero con estructura desorganizada (outputs mezclados con fuentes, sin separación de responsabilidades, naming inconsistente).

**Restructuración del proyecto:**
- `common/` renombrado a `shared/`
- Servicios de electron renombrados a kebab-case
- Componentes Angular movidos a `features/`, `ElectronService` a `core/services/`
- Toda la salida de compilación consolidada en `dist/` (antes dispersa en `electron/target/`)
- Handlers IPC extraídos de `main.ts` a `electron/ipc/` con constantes de canal en `channels.ts`

**Bundler:**
- Añadido esbuild como bundler para el main process de Electron
- `tsc` conservado únicamente para type-checking (`noEmit: true`)
- tsconfig de electron limpiado (eliminadas opciones de emisión)

---

## Pasos siguientes

- Introducir tecnología de tests en frontend (Jest o Karma/Jasmine) y backend (Jest o Vitest)
- Crear estructura de carpetas para tests en ambos proyectos
- Introducir Prettier y/o ESLint para formateo y calidad de código
