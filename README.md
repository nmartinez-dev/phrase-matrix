# Matriz de frases

## Descripción
Matriz de frases es una aplicación web moderna diseñada para ayudarte a organizar y visualizar frases y conceptos de manera intuitiva. La aplicación te permite crear, gestionar y visualizar relaciones entre diferentes frases en un formato matricial interactivo.

## Características Principales
- 🎯 Interfaz de usuario moderna y responsiva
- 📊 Visualización matricial de frases
- 🎨 Personalización de temas y estilos
- 💾 Guardado automático de cambios
- 📱 Compatible con dispositivos móviles
- 🔍 Búsqueda en tiempo real
- 🛡️ Protección contra XSS
- ⚡ Optimización de rendimiento con React.memo

## Requisitos
- Node.js (versión 18 o superior)
- npm (versión 9 o superior) o yarn (versión 1.22 o superior)
- Navegador moderno con soporte para JavaScript ES6+

## Instalación
1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/phrase-matrix.git
cd phrase-matrix
```

2. Instala las dependencias:
```bash
npm install
# o
yarn install
```

3. Inicia la aplicación en modo desarrollo:
```bash
npm run dev
# o
yarn dev
```

## Comandos Útiles

### Desarrollo
```bash
# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de la versión de producción
npm run preview

# Ejecutar linter
npm run lint

# Formatear código
npm run format
```

### Testing
```bash
# Ejecutar tests en modo watch
npm run test

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar tests en modo CI
npm run test:ci
```

### Construcción y Despliegue
```bash
# Construir la aplicación
npm run build

# Analizar el bundle
npm run analyze

# Desplegar a producción
npm run deploy
```

## Tecnologías Utilizadas

### Frontend
- **React 18**: Biblioteca para construir interfaces de usuario
- **TypeScript**: Superset tipado de JavaScript
- **Next.js**: Framework de React para producción
- **Tailwind CSS**: Framework de utilidades CSS
- **shadcn/ui**: Componentes de UI reutilizables
- **date-fns**: Manipulación de fechas
- **DOMPurify**: Sanitización de contenido HTML

### Herramientas de Desarrollo
- **Vite**: Bundler y servidor de desarrollo
- **ESLint**: Linter de código
- **Prettier**: Formateador de código
- **Jest**: Framework de testing
- **React Testing Library**: Utilidades para testing de componentes
- **Vitest**: Runner de tests para Vite

## Consideraciones Técnicas

### Rendimiento
- Uso de `React.memo` para optimizar el rendimiento de componentes
- Implementación de virtualización para listas largas
- Lazy loading de componentes
- Optimización de imágenes y assets

### Seguridad
- Sanitización de contenido HTML con DOMPurify
- Validación de entrada de datos
- Protección contra XSS
- Manejo seguro de localStorage

### Estado y Persistencia
- Gestión de estado con React Context
- Persistencia local con localStorage
- Manejo de errores y recuperación de datos

### Accesibilidad
- Soporte para lectores de pantalla
- Navegación por teclado
- Contraste de colores adecuado
- Mensajes de error descriptivos

### Internacionalización
- Soporte para múltiples idiomas
- Formateo de fechas según localización
- Textos adaptables

## Estructura del Proyecto
```
src/
├── app/             # Páginas y rutas
├── components/      # Componentes reutilizables
├── contexts/        # Contextos de React
├── hooks/           # Hooks personalizados
├── lib/             # Utilidades y configuraciones
├── styles/          # Estilos globales
└── types/           # Definiciones de TypeScript
```
