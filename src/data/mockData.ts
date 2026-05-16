import branding from "@/assets/course-branding.jpg";
import illustration from "@/assets/course-illustration.jpg";
import motion from "@/assets/course-motion.jpg";
import typography from "@/assets/course-typography.jpg";
import uiux from "@/assets/course-uiux.jpg";
import photo from "@/assets/course-photo.jpg";

export type Lesson = { id: string; title: string; duration: string; video?: string };
export type Module = { id: string; title: string; lessons: Lesson[] };
export type Course = {
  id: string;
  title: string;
  category: string;
  instructor: string;
  instructorId: string;
  price: number;
  image: string;
  description: string;
  published: boolean;
  modules: Module[];
};

const mod = (id: string, title: string, lessons: [string, string][]): Module => ({
  id,
  title,
  lessons: lessons.map(([t, d], i) => ({ id: `${id}-l${i}`, title: t, duration: d })),
});

export const courses: Course[] = [
  {
    id: "c1",
    title: "Identidad de marca desde cero",
    category: "Branding",
    instructor: "Marta Ríos",
    instructorId: "u-marta",
    price: 97,
    image: branding,
    description:
      "Aprende a construir una identidad de marca completa, desde la investigación estratégica hasta el manual final. Un proceso real, paso a paso.",
    published: true,
    modules: [
      mod("m1", "Estrategia y descubrimiento", [["Bienvenida al curso", "2:14"], ["Investigación de marca", "12:08"], ["Definir el territorio", "9:45"]]),
      mod("m2", "Sistema visual", [["Logotipo y marca gráfica", "18:22"], ["Color y tipografía", "14:30"], ["Aplicaciones", "10:12"]]),
      mod("m3", "Manual y entrega", [["Construir el manual", "16:00"], ["Presentar al cliente", "11:25"]]),
    ],
  },
  {
    id: "c2",
    title: "Ilustración botánica con acuarela",
    category: "Ilustración",
    instructor: "Lucía Moreno",
    instructorId: "u-lucia",
    price: 127,
    image: illustration,
    description:
      "Descubre la magia de la acuarela aplicada a la ilustración botánica. Técnica, observación y composición para obras únicas.",
    published: true,
    modules: [
      mod("m1", "Materiales y técnica base", [["Tu kit de acuarela", "6:00"], ["Aguadas y degradados", "11:20"]]),
      mod("m2", "Estudios botánicos", [["Hojas y tallos", "14:00"], ["Flores en detalle", "18:30"]]),
      mod("m3", "Composición final", [["Bocetar la obra", "10:10"], ["Pintar la obra final", "22:00"]]),
    ],
  },
  {
    id: "c3",
    title: "Motion graphics para redes",
    category: "Motion",
    instructor: "Diego Ferrer",
    instructorId: "u-diego",
    price: 197,
    image: motion,
    description:
      "Crea animaciones vibrantes para Instagram, TikTok y campañas digitales usando After Effects desde cero.",
    published: true,
    modules: [
      mod("m1", "Fundamentos de animación", [["Principios clave", "8:40"], ["Timing y easing", "12:00"]]),
      mod("m2", "Proyecto en After Effects", [["Setup del proyecto", "10:00"], ["Animación principal", "20:15"], ["Exportar para redes", "7:30"]]),
    ],
  },
  {
    id: "c4",
    title: "Tipografía editorial moderna",
    category: "Diseño",
    instructor: "Marta Ríos",
    instructorId: "u-marta",
    price: 147,
    image: typography,
    description:
      "Construye sistemas tipográficos sólidos para revistas, libros y proyectos editoriales con sensibilidad contemporánea.",
    published: true,
    modules: [
      mod("m1", "Anatomía y selección", [["La voz de la tipografía", "9:00"], ["Pareja tipográfica", "13:00"]]),
      mod("m2", "Maquetar editorial", [["Retícula editorial", "15:00"], ["Jerarquía y ritmo", "12:40"]]),
    ],
  },
  {
    id: "c5",
    title: "Diseño de producto digital UI/UX",
    category: "Producto",
    instructor: "Diego Ferrer",
    instructorId: "u-diego",
    price: 297,
    image: uiux,
    description:
      "Diseña productos digitales reales: investigación, wireframes, sistemas de diseño y entrega lista para desarrollo.",
    published: true,
    modules: [
      mod("m1", "Research y discovery", [["Entrevistas a usuarios", "11:00"], ["Mapeo de oportunidades", "9:30"]]),
      mod("m2", "Diseño de interfaz", [["Wireframes", "14:10"], ["Sistema de diseño", "18:00"], ["Prototipo final", "16:25"]]),
    ],
  },
  {
    id: "c6",
    title: "Fotografía analógica creativa",
    category: "Fotografía",
    instructor: "Lucía Moreno",
    instructorId: "u-lucia",
    price: 497,
    image: photo,
    description:
      "Una masterclass profunda sobre película, luz y composición para crear una serie fotográfica con identidad propia.",
    published: false,
    modules: [
      mod("m1", "Cámara y película", [["Elegir tu cámara", "10:00"], ["Tipos de película", "12:00"]]),
      mod("m2", "Crear una serie", [["Concepto y guion visual", "14:00"], ["Disparar la serie", "18:00"], ["Edición final", "11:00"]]),
    ],
  },
];

export const enrollments = [
  { courseId: "c1", progress: 65 },
  { courseId: "c3", progress: 20 },
  { courseId: "c4", progress: 100 },
];

export const instructors = [
  { id: "u-marta", name: "Marta Ríos" },
  { id: "u-lucia", name: "Lucía Moreno" },
  { id: "u-diego", name: "Diego Ferrer" },
];
