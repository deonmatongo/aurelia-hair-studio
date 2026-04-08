import { motion } from "framer-motion";
import { Instagram, ShoppingBag, MessageCircle, Star } from "lucide-react";
import aureliaLogo from "@/assets/aurelia-logo.png";
import heroImage from "@/assets/hero-hair.jpg";
import LinkButton from "@/components/LinkButton";

const links = [
  { href: "/shop", label: "Shop Hair", icon: <ShoppingBag className="h-4 w-4" /> },
  { href: "#", label: "Instagram", icon: <Instagram className="h-4 w-4" /> },
  { href: "#", label: "TikTok", icon: <Star className="h-4 w-4" /> },
  { href: "#", label: "WhatsApp", icon: <MessageCircle className="h-4 w-4" /> },
];

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Hero section with image */}
      <div className="relative h-[65vh] w-full overflow-hidden">
        <img
          src={heroImage}
          alt="Luxurious flowing hair"
          className="h-full w-full object-cover object-top"
          width={1080}
          height={1920}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      {/* Content */}
      <div className="relative -mt-20 flex flex-col items-center px-6 pb-16">
        {/* Logo */}
        <div className="mb-2 overflow-hidden" style={{ height: '8rem' }}>
          <motion.img
            src={aureliaLogo}
            alt="Aurélia Hair"
            className="h-52 w-auto"
            style={{ marginTop: '-5rem', filter: "sepia(1) saturate(8) hue-rotate(310deg) brightness(0.32)", mixBlendMode: "multiply" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          />
        </div>

        <motion.p
          className="font-display text-lg italic tracking-wide text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Crowning You in Elegance
        </motion.p>

        <motion.p
          className="mt-1 font-body text-xs tracking-[0.25em] uppercase text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Luxury hair by Dadiso
        </motion.p>

        {/* Divider */}
        <motion.div
          className="my-6 h-px w-16 bg-rosegold/40"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        />

        {/* Bio */}
        <motion.p
          className="mb-8 max-w-xs text-center font-body text-sm leading-relaxed text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          Soft. Luxurious. Effortless beauty. ✨
          <br />
          <span className="text-foreground/70">Premium hair for the Aurélia girl</span>
        </motion.p>

        {/* Link tree */}
        <div className="flex w-full max-w-sm flex-col gap-3">
          {links.map((link, i) => (
            <LinkButton
              key={link.label}
              href={link.href}
              label={link.label}
              icon={link.icon}
              delay={0.8 + i * 0.1}
            />
          ))}
        </div>

        {/* Footer */}
        <motion.p
          className="mt-12 font-display text-xs tracking-[0.3em] uppercase text-muted-foreground/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          AURÉLIA HAIR 2026
        </motion.p>
      </div>
    </div>
  );
};

export default Index;
