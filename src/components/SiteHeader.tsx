import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { homeFor } from "@/lib/auth";

const SiteHeader = () => {
  const { profile, role, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="container flex h-16 items-center justify-between bg-[#f2f2f2]">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-tight font-sans">Academia</span>
          <span className="text-2xl font-semibold italic font-sans text-primary">Creativa</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink
            to="/courses"
            className={({ isActive }) =>
              `font-medium font-sans transition-smooth text-base ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`
            }
          >
            Cursos
          </NavLink>
          {role && (
            <NavLink
              to={homeFor(role)}
              className={({ isActive }) =>
                `text-sm font-medium font-sans transition-smooth ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`
              }
            >
              Mi panel
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {role ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                Hola,{" "}
                <span className="font-medium font-sans text-foreground">
                  {profile?.full_name ?? "Usuario"}
                </span>
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Salir
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="rounded-full px-5">
              <Link to="/login">Entrar</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
