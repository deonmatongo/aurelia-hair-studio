import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface LinkButtonProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
  delay?: number;
}

const btnClass =
  "group flex w-full items-center justify-between rounded-full border border-border bg-cream px-6 py-4 font-body text-sm tracking-widest uppercase transition-all duration-300 hover:bg-rosegold hover:text-primary-foreground hover:border-rosegold";

const LinkButton = ({ href, label, icon, delay = 0 }: LinkButtonProps) => {
  const isInternal = href.startsWith("/");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {isInternal ? (
        <Link to={href} className={btnClass}>
          <span className="flex items-center gap-3">
            {icon}
            {label}
          </span>
          <ExternalLink className="h-4 w-4 opacity-40 transition-opacity group-hover:opacity-100" />
        </Link>
      ) : (
        <a href={href} target="_blank" rel="noopener noreferrer" className={btnClass}>
          <span className="flex items-center gap-3">
            {icon}
            {label}
          </span>
          <ExternalLink className="h-4 w-4 opacity-40 transition-opacity group-hover:opacity-100" />
        </a>
      )}
    </motion.div>
  );
};

export default LinkButton;
