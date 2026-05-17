# Academia Creativa

Plataforma de educación online en diseño gráfico, branding y comunicación visual orientada a profesionales creativos hispanohablantes. Permite a los estudiantes matricularse en cursos, seguir su progreso lección a lección y obtener un certificado digital al completarlos. Los instructores pueden crear y publicar sus propios cursos con módulos, lecciones y vídeos; los administradores gestionan toda la plataforma (usuarios, cursos, eventos y leads).

---

## Funcionalidades principales

- **Catálogo público de cursos** con filtros por categoría y página de detalle.
- **Tres roles diferenciados**: administrador, instructor y estudiante, cada uno con su panel y permisos correspondientes.
- **Matriculación de estudiantes** con seguimiento de progreso por lección y porcentaje de avance.
- **Visor de cursos** con reproducción de vídeo y marcado manual de lecciones completadas.
- **Generación de certificado digital en PDF** al completar todas las lecciones de un curso. Diseño profesional en A4 horizontal con fuentes Playfair Display y Lato.
- **Editor de cursos** para instructores y admin con creación dinámica de módulos y lecciones, y gestión de categorías.
- **Gestión de eventos** con doble flujo de reserva: usuarios autenticados (`event_reservations`) y leads anónimos (`event_leads`).
- **Panel de administración** con métricas, gestión de usuarios (asignación y eliminación de roles), gestión de leads de eventos y orden por rol.
- **Autenticación con Supabase Auth** y **Row Level Security** (RLS) configurada para cada tabla según rol.

---

## Stack técnico

| Capa | Tecnología |
|---|---|
| Framework | React 18 + TypeScript |
| Bundler | Vite 5 |
| Estilos | Tailwind CSS 3 + Shadcn UI + Radix UI |
| Router | React Router DOM v6 |
| Estado servidor | TanStack Query v5 |
| Formularios | React Hook Form + Zod |
| Iconos | Lucide React |
| Toasts | Sonner |
| Certificados PDF | @react-pdf/renderer |
| Base de datos | Supabase (PostgreSQL 17) |
| Autenticación | Supabase Auth |
| Testing | Vitest + Testing Library |
| Package manager | bun |

---

## Comandos habituales

```bash
bun install      # instalar dependencias
bun dev          # servidor de desarrollo
bun build        # build de producción
bun lint         # linter
bun test         # tests
```

---

## Estructura del proyecto

```
src/
├── pages/          # Vistas (una por ruta)
├── components/     # Componentes reutilizables + ui/ (Shadcn)
├── context/        # AuthContext
├── data/           # Tipos compartidos
├── lib/            # Clientes y utilidades (supabase, courseApi, eventApi, auth)
├── hooks/          # Custom hooks
└── assets/         # Recursos estáticos
public/
└── fonts/          # Fuentes locales para los certificados PDF
```

---

## Rutas

| Ruta | Componente | Acceso |
|---|---|---|
| `/` | `Index` | Público |
| `/courses` | `Courses` | Público |
| `/course/:id` | `CoursePage` | Público |
| `/event/:id` | `EventPage` | Público |
| `/login` | `Login` | Público |
| `/signup` | `SignUp` | Público |
| `/student` | `StudentDashboard` | Estudiante |
| `/learn/:id` | `CourseViewer` | Estudiante matriculado |
| `/admin` | `CoursesAdminList` | Admin |
| `/admin/course/:id` | `CourseEditor` | Admin |
| `/instructor` | `CoursesAdminList` | Instructor |
| `/instructor/course/:id` | `CourseEditor` | Instructor |

---

## Modelo de datos (Supabase)

Tablas principales: `profiles`, `courses`, `modules`, `lessons`, `enrollments`, `lesson_progress`, `categories`, `events`, `event_reservations`, `event_leads`.

La seguridad se gestiona con políticas RLS por rol. Para evitar dependencias circulares entre `courses` y `enrollments` (un estudiante matriculado puede ver su curso aunque esté en borrador), se usan funciones `SECURITY DEFINER` (`is_enrolled_in_course`, `is_course_instructor`) que devuelven sólo booleanos y nunca exponen filas completas.

---

## Configuración

Crear un fichero `.env` en la raíz con:

```
VITE_SUPABASE_URL=tu_url_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key
```

---

## Licencia

Proyecto privado — Academia Creativa.
