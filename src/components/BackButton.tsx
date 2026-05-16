import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  fallback?: string;
  label?: string;
  className?: string;
}

const BackButton = ({ fallback = "/", label = "Volver", className }: BackButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/") return null;

  const handleClick = () => {
    const idx = (window.history.state && (window.history.state as { idx?: number }).idx) ?? 0;
    if (idx > 0) navigate(-1);
    else navigate(fallback);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      <ArrowLeft className="h-4 w-4" /> {label}
    </button>
  );
};

export default BackButton;
