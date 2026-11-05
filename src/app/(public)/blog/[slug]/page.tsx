import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BLOG_POSTS, getBlogPost } from "@/lib/content";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Blog" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <article>
        <section className="border-b border-white/10 bg-gradient-to-b from-charcoal-light to-charcoal py-10 sm:py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <nav className="text-sm text-zinc-500">
              <Link href="/" className="hover:text-gold">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/blog" className="hover:text-gold">
                Blog
              </Link>
              <span className="mx-2">/</span>
              <span className="text-zinc-300">{post.category}</span>
            </nav>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-gold">
              {post.category}
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-3 text-sm text-zinc-500">
              {post.dateLabel} · By {post.author} · {post.readMins} min read
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/10">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width:768px) 100vw, 768px"
            />
          </div>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-zinc-300">
            {post.content.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/book"
              className="rounded-full bg-gold px-6 py-3 text-sm font-bold text-charcoal transition hover:bg-gold-light"
            >
              Book a caravan
            </Link>
            <Link
              href="/destinations"
              className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:border-gold hover:text-gold"
            >
              Browse destinations
            </Link>
          </div>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="border-t border-white/10 py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-xl font-bold text-white">More stories</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="card-hover overflow-hidden rounded-2xl border border-white/10 bg-charcoal-light"
                >
                  <div className="relative aspect-[16/10]">
                    <Image src={item.image} alt={item.title} fill className="object-cover" sizes="50vw" />
                  </div>
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-wider text-gold">{item.category}</p>
                    <p className="mt-2 font-semibold text-white">{item.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
