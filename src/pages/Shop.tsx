import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Plus, Minus, Trash2, X, MessageCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import aureliaLogo from "@/assets/aurelia-logo.png";

// ─── Update this to your WhatsApp number (digits only, with country code) ───
const WHATSAPP_NUMBER = "27000000000";

// ─── Product catalogue ───────────────────────────────────────────────────────
type Product = {
  id: number;
  name: string;
  description: string;
  category: string;
  variants: { label: string; price: number }[];
  emoji: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Brazilian Body Wave",
    description: "Soft, bouncy waves with natural lustre. Full & tangle-free.",
    category: "Bundles",
    emoji: "🌊",
    variants: [
      { label: '14"', price: 750 },
      { label: '16"', price: 850 },
      { label: '18"', price: 950 },
      { label: '20"', price: 1050 },
      { label: '22"', price: 1150 },
      { label: '24"', price: 1300 },
    ],
  },
  {
    id: 2,
    name: "Brazilian Straight",
    description: "Silky smooth, sleek straight hair. Blends seamlessly.",
    category: "Bundles",
    emoji: "✨",
    variants: [
      { label: '14"', price: 700 },
      { label: '16"', price: 800 },
      { label: '18"', price: 900 },
      { label: '20"', price: 1000 },
      { label: '22"', price: 1100 },
      { label: '24"', price: 1250 },
    ],
  },
  {
    id: 3,
    name: "Deep Wave Bundles",
    description: "Defined, voluminous curls with a gorgeous deep wave pattern.",
    category: "Bundles",
    emoji: "💫",
    variants: [
      { label: '14"', price: 800 },
      { label: '16"', price: 900 },
      { label: '18"', price: 1000 },
      { label: '20"', price: 1100 },
      { label: '22"', price: 1250 },
    ],
  },
  {
    id: 4,
    name: "Loose Deep Wave",
    description: "Effortless loose curls — big, bouncy and full of life.",
    category: "Bundles",
    emoji: "🌸",
    variants: [
      { label: '16"', price: 900 },
      { label: '18"', price: 1000 },
      { label: '20"', price: 1100 },
      { label: '22"', price: 1250 },
    ],
  },
  {
    id: 5,
    name: "4×4 Lace Closure",
    description: "Invisible knots, natural hairline. Body Wave & Straight available.",
    category: "Closures & Frontals",
    emoji: "👑",
    variants: [
      { label: 'Body Wave 12"', price: 650 },
      { label: 'Body Wave 14"', price: 750 },
      { label: 'Straight 12"', price: 600 },
      { label: 'Straight 14"', price: 700 },
    ],
  },
  {
    id: 6,
    name: "5×5 HD Lace Closure",
    description: "Ultra-thin HD lace for a flawless, undetectable finish.",
    category: "Closures & Frontals",
    emoji: "💎",
    variants: [
      { label: 'Body Wave 12"', price: 800 },
      { label: 'Body Wave 14"', price: 900 },
      { label: 'Straight 12"', price: 750 },
      { label: 'Straight 14"', price: 850 },
    ],
  },
  {
    id: 7,
    name: "13×4 Lace Frontal",
    description: "Full frontal coverage, ear-to-ear. Style parting freely.",
    category: "Closures & Frontals",
    emoji: "🌟",
    variants: [
      { label: 'Body Wave 12"', price: 1100 },
      { label: 'Body Wave 14"', price: 1200 },
      { label: 'Straight 12"', price: 1000 },
      { label: 'Straight 14"', price: 1100 },
    ],
  },
  {
    id: 8,
    name: "Body Wave Wig",
    description: "Ready-to-wear glueless wig. Natural density, pre-plucked hairline.",
    category: "Wigs",
    emoji: "✨",
    variants: [
      { label: '16" 150% density', price: 2200 },
      { label: '18" 150% density', price: 2500 },
      { label: '20" 180% density', price: 2900 },
      { label: '22" 180% density', price: 3300 },
    ],
  },
  {
    id: 9,
    name: "Straight HD Wig",
    description: "Sleek and polished. HD lace front for a natural scalp look.",
    category: "Wigs",
    emoji: "💅",
    variants: [
      { label: '16" 150% density', price: 2100 },
      { label: '18" 150% density', price: 2400 },
      { label: '20" 180% density', price: 2800 },
    ],
  },
];

const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

// ─── Cart types ──────────────────────────────────────────────────────────────
type CartItem = {
  productId: number;
  productName: string;
  variant: string;
  price: number;
  qty: number;
};

// ─── WhatsApp message builder ────────────────────────────────────────────────
function buildWhatsAppMessage(cart: CartItem[]): string {
  const lines = cart.map(
    (item) => `• ${item.productName} — ${item.variant} × ${item.qty}  →  R${(item.price * item.qty).toLocaleString()}`
  );
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const message = [
    "Hello Aurélia Hair! 👑",
    "",
    "I'd like to place the following order:",
    "",
    "📦 *ORDER DETAILS*",
    ...lines,
    "",
    `💰 *Total: R${total.toLocaleString()}*`,
    "",
    "Please confirm availability and delivery details. Thank you! ✨",
  ].join("\n");

  return message;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<Record<number, number>>({});

  const filteredProducts =
    activeCategory === "All" ? products : products.filter((p) => p.category === activeCategory);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  function getSelectedVariant(product: Product) {
    const idx = selectedVariants[product.id] ?? 0;
    return product.variants[idx];
  }

  function addToCart(product: Product) {
    const variant = getSelectedVariant(product);
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.productId === product.id && i.variant === variant.label
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id && i.variant === variant.label
            ? { ...i, qty: i.qty + 1 }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          variant: variant.label,
          price: variant.price,
          qty: 1,
        },
      ];
    });
  }

  function updateQty(productId: number, variant: string, delta: number) {
    setCart((prev) =>
      prev
        .map((i) =>
          i.productId === productId && i.variant === variant
            ? { ...i, qty: i.qty + delta }
            : i
        )
        .filter((i) => i.qty > 0)
    );
  }

  function removeItem(productId: number, variant: string) {
    setCart((prev) =>
      prev.filter((i) => !(i.productId === productId && i.variant === variant))
    );
  }

  function sendToWhatsApp() {
    if (cart.length === 0) return;
    const message = buildWhatsAppMessage(cart);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── Nav ── */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/90 px-6 py-4 backdrop-blur-sm">
        <Link
          to="/"
          className="flex items-center gap-2 font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <img
          src={aureliaLogo}
          alt="Aurélia Hair"
          className="h-10 w-auto"
          style={{ filter: "sepia(1) saturate(8) hue-rotate(310deg) brightness(0.32)" }}
        />

        <button
          onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
        >
          <ShoppingBag className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-burgundy text-[10px] font-bold text-white">
              {cartCount}
            </span>
          )}
        </button>
      </header>

      {/* ── Page heading ── */}
      <div className="px-6 pt-10 pb-6 text-center">
        <motion.h1
          className="font-display text-4xl font-light tracking-wide"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          The Collection
        </motion.h1>
        <motion.p
          className="mt-2 font-body text-sm tracking-widest uppercase text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Premium hair, crafted for you
        </motion.p>
      </div>

      {/* ── Category tabs ── */}
      <div className="flex gap-2 overflow-x-auto px-6 pb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 rounded-full px-5 py-2 font-body text-xs tracking-widest uppercase transition-all duration-200 ${
              activeCategory === cat
                ? "bg-burgundy text-white"
                : "border border-border bg-cream text-muted-foreground hover:border-burgundy"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Product grid ── */}
      <div className="grid grid-cols-1 gap-5 px-6 pb-32 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product, i) => {
            const variantIdx = selectedVariants[product.id] ?? 0;
            const selectedVariant = product.variants[variantIdx];

            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="flex flex-col rounded-2xl border border-border bg-cream p-5"
              >
                {/* Product emoji / visual */}
                <div className="mb-4 flex h-28 items-center justify-center rounded-xl bg-cream-deep text-5xl">
                  {product.emoji}
                </div>

                {/* Info */}
                <p className="mb-1 font-body text-[10px] tracking-[0.25em] uppercase text-burgundy">
                  {product.category}
                </p>
                <h3 className="font-display text-xl font-medium">{product.name}</h3>
                <p className="mt-1 font-body text-xs leading-relaxed text-muted-foreground">
                  {product.description}
                </p>

                {/* Variant selector */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {product.variants.map((v, idx) => (
                    <button
                      key={v.label}
                      onClick={() =>
                        setSelectedVariants((prev) => ({ ...prev, [product.id]: idx }))
                      }
                      className={`rounded-full px-3 py-1 font-body text-[10px] tracking-wider uppercase transition-all ${
                        variantIdx === idx
                          ? "bg-burgundy text-white"
                          : "border border-border bg-background text-muted-foreground hover:border-burgundy"
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>

                {/* Price + Add to cart */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-display text-2xl font-light">
                    R{selectedVariant.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="flex items-center gap-2 rounded-full bg-burgundy px-5 py-2 font-body text-xs tracking-widest uppercase text-white transition-all hover:opacity-80 active:scale-95"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── Floating cart button (mobile) ── */}
      {cartCount > 0 && (
        <motion.button
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full bg-foreground px-6 py-3.5 font-body text-sm tracking-widest uppercase text-background shadow-xl"
        >
          <ShoppingBag className="h-4 w-4" />
          View Cart · {cartCount} {cartCount === 1 ? "item" : "items"}
          <span className="font-light opacity-60">R{cartTotal.toLocaleString()}</span>
        </motion.button>
      )}

      {/* ── Cart drawer ── */}
      <AnimatePresence>
        {cartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
            />

            {/* Drawer */}
            <motion.aside
              className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-sm flex-col bg-background shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between border-b border-border px-6 py-5">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-burgundy" />
                  <h2 className="font-display text-xl">Your Order</h2>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="rounded-full p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Cart items */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 pt-20 text-center">
                    <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
                    <p className="font-body text-sm text-muted-foreground">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {cart.map((item) => (
                      <div
                        key={`${item.productId}-${item.variant}`}
                        className="flex items-start justify-between gap-3 rounded-xl border border-border bg-cream p-4"
                      >
                        <div className="flex-1">
                          <p className="font-body text-sm font-medium">{item.productName}</p>
                          <p className="font-body text-xs text-muted-foreground">{item.variant}</p>
                          <p className="mt-1 font-display text-lg">
                            R{(item.price * item.qty).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <button
                            onClick={() => removeItem(item.productId, item.variant)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1">
                            <button
                              onClick={() => updateQty(item.productId, item.variant, -1)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-4 text-center font-body text-sm">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.productId, item.variant, 1)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart footer */}
              {cart.length > 0 && (
                <div className="border-t border-border px-6 py-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-body text-sm text-muted-foreground">Order Total</span>
                    <span className="font-display text-2xl">R{cartTotal.toLocaleString()}</span>
                  </div>
                  <p className="mb-4 font-body text-[10px] leading-relaxed text-muted-foreground/70">
                    Tap below to send your order directly to us on WhatsApp. We'll confirm availability &amp; arrange delivery.
                  </p>
                  <button
                    onClick={sendToWhatsApp}
                    className="flex w-full items-center justify-center gap-3 rounded-full bg-[#25D366] py-4 font-body text-sm tracking-widest uppercase text-white shadow-lg transition-all hover:opacity-90 active:scale-[0.98]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Send Order to WhatsApp
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
