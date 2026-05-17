import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "¿Cómo accedo a los cursos?",
    a: "Para acceder a los cursos, es necesario crear una cuenta en Academia Creativa de forma gratuita. Una vez registrado, recibirás un correo electrónico de confirmación para verificar tu cuenta. Tras completar la matriculación en el curso de tu elección, tendrás acceso inmediato a todo el contenido desde tu panel de estudiante, donde podrás ver los vídeos, revisar los materiales y retomar cada lección cuando lo desees, sin ninguna restricción adicional.",
  },
  {
    q: "¿Los cursos tienen horario?",
    a: "No, en absoluto. Todos nuestros cursos son 100% asíncronos, lo que significa que tú decides cuándo y cómo aprender. Puedes avanzar a tu ritmo, pausar cuando necesites y retomar el contenido en cualquier momento desde cualquier dispositivo.",
  },
  {
    q: "¿Cuánto duran los cursos?",
    a: "La duración varía según el curso y el nivel de profundidad del temario, pero no existe ningún límite de tiempo para completarlos. Una vez matriculado, el acceso al contenido es indefinido, por lo que puedes tomarte el tiempo que necesites para absorber bien cada lección.",
  },
  {
    q: "¿Recibiré un certificado?",
    a: "Sí. Al completar todas las lecciones del curso, recibirás un certificado digital a tu nombre que acredita la formación realizada. Podrás descargarlo y compartirlo en tu portfolio o perfil profesional.",
  },
  {
    q: "¿Necesito experiencia previa?",
    a: "No necesariamente. En Academia Creativa encontrarás cursos pensados para distintos perfiles y niveles: desde quienes se inician en el diseño hasta profesionales que buscan especializarse o actualizar sus habilidades. Cada curso indica su nivel recomendado para que puedas elegir el más adecuado para ti.",
  },
];

const FAQ = () => {
  return (
    <section className="container py-[24px]">
      <div className="mx-auto max-w-3xl font-sans">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold md:text-4xl font-sans">Preguntas frecuentes</h2>
          <p className="mt-3 text-secondary-foreground text-base">
            Todo lo que necesitas saber antes de empezar
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base font-medium md:text-lg font-sans">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
