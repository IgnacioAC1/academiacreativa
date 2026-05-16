import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "¿Cómo accedo a los cursos?",
    a: "Tras la compra, tendrás acceso inmediato desde tu cuenta a todo el contenido del curso.",
  },
  {
    q: "¿Los cursos tienen horario?",
    a: "No. Puedes aprender a tu ritmo y acceder a los contenidos cuando quieras.",
  },
  {
    q: "¿Cuánto duran los cursos?",
    a: "Depende del curso, pero puedes completarlos a tu ritmo sin límite de tiempo.",
  },
  {
    q: "¿Recibiré un certificado?",
    a: "Sí, al completar el curso recibirás un certificado con tu nombre.",
  },
  {
    q: "¿Necesito experiencia previa?",
    a: "No necesariamente. Hay cursos para distintos niveles, desde iniciación hasta avanzado.",
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
