import { TrendingUp, TrendingDown, Users, Euro, BookOpen } from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { courses } from "@/data/mockData";

const revenueSeries = [
  { month: "Nov", value: 18420 },
  { month: "Dic", value: 21100 },
  { month: "Ene", value: 19850 },
  { month: "Feb", value: 24600 },
  { month: "Mar", value: 26300 },
  { month: "Abr", value: 29470 },
];

const currentRevenue = revenueSeries[revenueSeries.length - 1].value;
const previousRevenue = revenueSeries[revenueSeries.length - 2].value;
const revenueDelta = ((currentRevenue - previousRevenue) / previousRevenue) * 100;

const studentStats = {
  newThisMonth: 184,
  totalActive: 2417,
  growth: 8.4,
};

const topCourses = [
  { id: courses[0].id, title: courses[0].title, students: 612 },
  { id: courses[4].id, title: courses[4].title, students: 487 },
  { id: courses[2].id, title: courses[2].title, students: 354 },
];
const maxStudents = Math.max(...topCourses.map((c) => c.students));

const formatEuro = (n: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

const DeltaPill = ({ value, suffix = "vs mes anterior" }: { value: number; suffix?: string }) => {
  const positive = value >= 0;
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium font-sans ${
        positive ? "bg-accent/15 text-accent" : "bg-destructive/15 text-destructive"
      }`}
    >
      <Icon className="h-3 w-3" />
      {positive ? "+" : ""}
      {value.toFixed(1)}% <span className="text-muted-foreground font-normal">{suffix}</span>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <section className="mb-12">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">Resumen del negocio</p>
        <h2 className="text-2xl font-semibold font-sans">Hola Laura, esto es lo que está pasando</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Revenue */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Euro className="h-4 w-4" />
                Ingresos del mes
              </div>
              <p className="mt-2 text-4xl font-semibold font-sans">{formatEuro(currentRevenue)}</p>
              <div className="mt-2">
                <DeltaPill value={revenueDelta} />
              </div>
            </div>
          </div>
          <div className="mt-5 h-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueSeries} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <XAxis dataKey="month" hide />
                <YAxis hide domain={["dataMin - 2000", "dataMax + 2000"]} />
                <Tooltip
                  cursor={{ stroke: "hsl(var(--border))" }}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => [formatEuro(v), "Ingresos"]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "hsl(var(--accent))" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Últimos 6 meses</p>
        </div>

        {/* Students */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            Estudiantes
          </div>
          <p className="mt-2 text-4xl font-semibold font-sans">+{studentStats.newThisMonth}</p>
          <p className="text-sm text-muted-foreground">nuevos este mes</p>
          <div className="mt-2">
            <DeltaPill value={studentStats.growth} />
          </div>
          <div className="mt-6 border-t border-border pt-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Activos totales</p>
            <p className="mt-1 text-2xl font-semibold font-sans">
              {studentStats.totalActive.toLocaleString("es-ES")}
            </p>
          </div>
        </div>

        {/* Top courses */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            Cursos más vendidos
          </div>
          <ul className="mt-4 space-y-4">
            {topCourses.map((c, i) => (
              <li key={c.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="truncate text-sm font-medium font-sans">
                    <span className="mr-2 text-muted-foreground">{i + 1}.</span>
                    {c.title}
                  </p>
                  <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                    {c.students} <span className="text-xs">est.</span>
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${(c.students / maxStudents) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
