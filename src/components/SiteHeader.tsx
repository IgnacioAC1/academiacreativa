import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
              `inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold font-sans transition-all duration-200 ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-sm"
              }`
            }
          >
            Cursos
          </NavLink>
          {role && (
            <NavLink
              to={homeFor(role)}
              className={({ isActive }) =>
                `inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold font-sans transition-all duration-200 ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-sm"
                }`
              }
            >
              Mi panel
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {role ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.full_name ?? "Usuario"} />
                    <AvatarFallback className="text-xs font-semibold font-sans">
                      {(profile?.full_name ?? profile?.email ?? "?")
                        .split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium font-sans sm:inline">
                    {profile?.full_name ?? "Usuario"}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/profile">Mi perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={homeFor(role)}>Mi panel</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
