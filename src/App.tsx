import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, ArrowRight, Search, Tag as TagIcon, Flame } from "lucide-react";
import clsx from "clsx";

type Post = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  tags: string[];
  readTime: number;
  trendy?: boolean;
};

/* --- SAMPLE POSTS (Replace with yours later) --- */
const POSTS: Post[] = [
  {
    id: "ai-summarizer",
    title: "Summarize Lectures with AI: Quick & Smart Workflow",
    excerpt:
      "Turn long lecture notes into 5 key takeaways and flashcards using ethical AI study methods.",
    content: `
## Why it matters
Students drown in information. Summarization saves hours.

## The Recipe
1. Record or transcribe.
2. Use ChatGPT / Notion AI to summarize and quiz you.
3. Review daily flashcards.

## Bonus Tip
Always verify AI answers before submission.`,
    date: "2025-10-21",
    tags: ["AI", "Study", "Automation"],
    readTime: 6,
    trendy: true,
  },
  {
    id: "perplexity-vs-chatgpt",
    title: "Perplexity vs ChatGPT — Which Is Better for Research?",
    excerpt:
      "We compared both tools for depth, accuracy, and citations. Here’s the real answer.",
    content: `
## TL;DR
Perplexity: better for quick, cited answers.  
ChatGPT: better for structured writing and brainstorming.`,
    date: "2025-09-18",
    tags: ["AI", "Comparison"],
    readTime: 8,
  },
  {
    id: "best-ai-slide-tools",
    title: "Top AI Slide Generators for Class Projects (Tested)",
    excerpt:
      "We built the same deck in 5 tools and scored clarity, speed, and creativity.",
    content: `
## Winners
- **Gamma.app** — for story-driven slides
- **Tome** — fast, minimal, clean layouts
- **Beautiful.ai** — best polish for free users`,
    date: "2025-08-30",
    tags: ["AI", "Design", "Tools"],
    readTime: 5,
  },
];

/* --- Utilities --- */
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-AU", { year: "numeric", month: "short", day: "numeric" });

const useTheme = () => {
  const [dark, setDark] = useState<boolean>(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    const root = document.documentElement;
    dark ? root.classList.add("dark") : root.classList.remove("dark");
  }, [dark]);
  return { dark, setDark };
};

/* --- Button component --- */
const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "solid" | "ghost" | "outline" }
> = ({ variant = "solid", className, ...props }) => (
  <button
    {...props}
    className={clsx(
      "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-medium transition",
      variant === "solid" && "bg-indigo-600 text-white hover:bg-indigo-700",
      variant === "outline" &&
        "border border-indigo-400 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-500 dark:text-indigo-400",
      variant === "ghost" && "text-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-400",
      className
    )}
  />
);

/* --- Navbar --- */
function Navbar({ dark, setDark }: { dark: boolean; setDark: (v: boolean) => void }) {
  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-700">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Nexora</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => setDark(!dark)} aria-label="Toggle theme">
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </nav>
  );
}

/* --- BlogCard --- */
function BlogCard({ post, onOpen }: { post: Post; onOpen: (p: Post) => void }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="cursor-pointer rounded-2xl border border-gray-200 bg-white/60 p-5 shadow-sm backdrop-blur transition hover:shadow-xl dark:border-gray-700 dark:bg-gray-800/60"
      onClick={() => onOpen(post)}
    >
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{formatDate(post.date)}</span>
        <span>{post.readTime} min read</span>
      </div>
      <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
        {post.title}
      </h3>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{post.excerpt}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {post.tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700 dark:bg-indigo-800/40 dark:text-indigo-300"
          >
            <TagIcon className="h-3 w-3" /> {t}
          </span>
        ))}
        {post.trendy && (
          <span className="inline-flex items-center gap-1 text-rose-500">
            <Flame className="h-3 w-3" /> Trending
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* --- PostView --- */
function PostView({ post, onBack }: { post: Post; onBack: () => void }) {
  const sections = post.content.split(/\n\n+/g);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Button variant="ghost" onClick={onBack} className="mb-4">
        ← Back
      </Button>
      <div className="rounded-2xl border border-gray-200 bg-white/70 p-6 shadow dark:border-gray-700 dark:bg-gray-800/60">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{post.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{formatDate(post.date)} • {post.readTime} min read</p>
        <div className="my-4 h-px bg-gray-200 dark:bg-gray-700" />
        <article className="prose max-w-none dark:prose-invert">
          {sections.map((block, i) => {
            if (block.startsWith("## ")) return <h2 key={i}>{block.replace(/^##\s+/, "")}</h2>;
            if (block.startsWith("- ")) {
              return (
                <ul key={i}>
                  {block
                    .split("\n")
                    .filter(Boolean)
                    .map((li, j) => (
                      <li key={j}>{li.replace(/^-+\s*/, "")}</li>
                    ))}
                </ul>
              );
            }
            return <p key={i}>{block}</p>;
          })}
        </article>
      </div>
    </motion.div>
  );
}

/* --- Root App --- */
export default function App() {
  const { dark, setDark } = useTheme();
  const [search, setSearch] = useState("");
  const [activePost, setActivePost] = useState<Post | null>(null);

  const filtered = useMemo(() => {
    return POSTS.filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.join(" ").toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white text-gray-900 dark:from-gray-900 dark:to-gray-950 dark:text-gray-100 transition-colors duration-500">
      <Navbar dark={dark} setDark={setDark} />

      <main className="mx-auto max-w-6xl px-4 py-10">
        {!activePost && (
          <>
            <div className="relative mb-10">
              <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
                Explore Modern Tech & AI Tools
              </h1>
              <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
                Hands-on guides, trends, and insights for the creative digital generation.
              </p>
              <div className="mt-6 relative max-w-md">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  className="w-full rounded-xl border border-gray-300 bg-white/70 py-2 pl-10 pr-3 text-sm outline-none ring-0 placeholder:text-gray-400 focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800/60"
                  placeholder="Search articles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {filtered.map((post) => (
                  <BlogCard key={post.id} post={post} onOpen={setActivePost} />
                ))}
              </AnimatePresence>
            </div>
          </>
        )}

        {activePost && <PostView post={activePost} onBack={() => setActivePost(null)} />}
      </main>

      <footer className="border-t border-gray-200 bg-white/70 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/60">
        © {new Date().getFullYear()} Nexora — Built with ❤️
      </footer>
    </div>
  );
}
