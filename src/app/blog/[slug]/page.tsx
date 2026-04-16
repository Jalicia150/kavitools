import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { marked } from "marked";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — KaviTools`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const html = await marked(post.content);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <a
        href="/blog"
        className="text-sm text-gray-500 hover:text-gray-300 transition mb-8 inline-block"
      >
        ← Back to blog
      </a>
      <article>
        <div className="mb-8">
          <div className="text-sm text-gray-500 mb-2">{post.date}</div>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <p className="text-lg text-gray-400">{post.description}</p>
        </div>
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
      <div className="mt-16 bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
        <h3 className="text-xl font-bold mb-2">Ready to create your first invoice?</h3>
        <p className="text-gray-400 mb-4">
          Professional PDF invoices in seconds. No signup required.
        </p>
        <a
          href="/create"
          className="inline-block bg-brand-600 hover:bg-brand-500 text-white px-6 py-2.5 rounded-lg transition shadow-lg shadow-brand-600/25"
        >
          Try KaviTools Free →
        </a>
      </div>
    </div>
  );
}
