import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { BLOG_POSTS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Trip reports, route guides, and honest advice for caravan travel across India.",
};

export default function BlogPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/gallery/exterior-side-road.png)" }}
        />
        <div className="absolute inset-0 bg-charcoal/85" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <nav className="text-sm text-zinc-400">
            <Link href="/" className="hover:text-gold">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-zinc-200">Blog</span>
          </nav>
          <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">
            Stories from the road
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-zinc-300">
            First-hand trip tips, route guides, and honest advice for caravan travel across India.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 sm:px-6">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.slug}
              className="card-hover overflow-hidden rounded-2xl border border-white/10 bg-charcoal-light"
            >
              <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition duration-500 hover:scale-105"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
                <span className="absolute bottom-3 right-3 flex h-14 w-14 flex-col items-center justify-center rounded-full bg-gold text-center text-[10px] font-bold leading-tight text-charcoal">
                  {post.dateLabel.split(" ").slice(0, 2).map((part) => (
                    <span key={part}>{part}</span>
                  ))}
                </span>
              </Link>
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-gold">
                  {post.category}
                </p>
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="mt-2 font-display text-xl font-bold text-white hover:text-gold">
                    {post.title}
                  </h2>
                </Link>
                <p className="mt-2 text-xs text-zinc-500">
                  By {post.author} · {post.readMins} min read
                </p>
                <p className="mt-3 text-sm text-zinc-400">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-block text-sm font-semibold uppercase tracking-wide text-gold hover:underline"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
