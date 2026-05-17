import { Link } from "react-router-dom";
import type { Course } from "@/data/mockData";

const CourseCard = ({ course, hidePrice = false }: { course: Course; hidePrice?: boolean }) => (
  <Link
    to={`/course/${course.id}`}
    className="group block overflow-hidden rounded-xl bg-card shadow-card transition-smooth hover:-translate-y-1 hover:shadow-lift"
  >
    <div className="aspect-[4/3] overflow-hidden bg-muted">
      <img
        src={course.image}
        alt={course.title}
        loading="lazy"
        width={1024}
        height={768}
        className="h-full w-full object-cover transition-smooth group-hover:scale-105"
      />
    </div>
    <div className="space-y-2 p-5">
      <span className="text-xs font-medium font-sans uppercase tracking-wider text-muted-foreground">
        {course.category}
      </span>
      <h3 className="text-xl font-semibold leading-snug font-sans">{course.title}</h3>
      <p className="text-sm text-muted-foreground">por {course.instructor}</p>
      <div className="flex items-baseline justify-between pt-2">
        {!hidePrice && (
          <span className="text-lg font-semibold text-foreground">
            {course.price === 0 ? "Gratis" : `${course.price} €`}
          </span>
        )}
        <span className="ml-auto text-sm font-medium font-sans text-primary opacity-0 transition-smooth group-hover:opacity-100">
          Ver curso →
        </span>
      </div>
    </div>
  </Link>
);

export default CourseCard;
