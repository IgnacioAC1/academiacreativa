import iconClock from "@/assets/icon-clock.jpg";
import iconLayers from "@/assets/icon-layers.jpg";
import iconBadge from "@/assets/icon-badge.jpg";
import teacherLaura from "@/assets/teacher-laura.jpg";
import teacherCarlos from "@/assets/teacher-carlos.jpg";
import teacherMarta from "@/assets/teacher-marta.jpg";

const instructors = [
  {
    name: "Laura Gómez",
    role: "Brand Designer",
    photo: teacherLaura,
    bio: "Especialista en identidad visual con más de 10 años creando marcas memorables.",
  },
  {
    name: "Carlos Ruiz",
    role: "Motion Designer",
    photo: teacherCarlos,
    bio: "Diseñador de animación que ha trabajado con marcas internacionales y estudios creativos.",
  },
  {
    name: "Marta Ríos",
    role: "Art Director",
    photo: teacherMarta,
    bio: "Dirige proyectos editoriales y campañas para clientes del sector cultural y lifestyle.",
  },
];

const features = [
  {
    icon: iconClock,
    title: "Aprende a tu ritmo",
    description:
      "Accede a los cursos cuando quieras y avanza a tu propio ritmo, sin horarios ni presiones.",
  },
  {
    icon: iconLayers,
    title: "Cursos 100% prácticos",
    description:
      "Proyectos reales y aplicables desde el primer día. Aprende haciendo, no solo viendo.",
  },
  {
    icon: iconBadge,
    title: "Profesores en activo",
    description:
      "Aprende de profesionales que trabajan en la industria y comparten su experiencia real.",
  },
];

const ValueProps = () => (
  <section className="container py-[24px]">
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <h2 className="text-3xl font-semibold md:text-4xl font-sans">
        ¿Por qué aprender con <em className="italic text-primary">Academia Creativa</em>?
      </h2>
      <p className="mt-3 text-secondary-foreground text-lg">
        Formación práctica pensada para diseñadores reales.
      </p>
      <p className="mt-4 text-center text-secondary-foreground text-xl">
        Más de <span className="font-semibold text-foreground">2.400 alumnos</span> ya están aprendiendo con nosotros
      </p>
    </div>

    <div className="grid gap-6 md:grid-cols-3">
      {features.map((f) => (
        <div
          key={f.title}
          className="rounded-2xl border border-border/60 bg-card p-7 shadow-card transition-smooth hover:-translate-y-1 hover:shadow-lift"
        >
          <div className="mb-5 h-16 w-16 overflow-hidden rounded-full">
            <img
              src={f.icon}
              alt={f.title}
              loading="lazy"
              width={512}
              height={512}
              className="h-full w-full object-cover"
            />
          </div>
          <h3 className="mb-2 text-xl font-semibold font-sans">{f.title}</h3>
          <p className="text-sm text-muted-foreground">{f.description}</p>
        </div>
      ))}
    </div>

    <div className="mt-16">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h3 className="text-2xl font-semibold md:text-3xl font-sans">Conoce a nuestros profesores</h3>
        <p className="mt-3 text-secondary-foreground text-lg">
          Profesionales en activo que comparten su experiencia contigo.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {instructors.map((i) => (
          <div
            key={i.name}
            className="flex flex-col items-center rounded-2xl border border-border/60 bg-card p-7 text-center shadow-card transition-smooth hover:-translate-y-1 hover:shadow-lift"
          >
            <div className="mb-5 h-28 w-28 overflow-hidden rounded-full ring-4 ring-primary/15">
              <img
                src={i.photo}
                alt={i.name}
                loading="lazy"
                width={512}
                height={512}
                className="h-full w-full object-cover"
              />
            </div>
            <h4 className="text-lg font-semibold font-sans text-foreground">{i.name}</h4>
            <p className="text-sm font-medium text-primary">{i.role}</p>
            <p className="mt-3 text-sm text-muted-foreground">{i.bio}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ValueProps;
