import { getAllPosts } from "@/lib/blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — KaviTools",
  description: "Tips on invoicing, getting paid, and running a freelance business.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-2">Blog</h1>
      <p className="text-gray-400 mb-12">
        Tips on invoicing, getting paid, and freelancing.
      </p>
      <div className="space-y-6">
        {posts.map((post) => (
          <a
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-brand-800 transition"
          >
            <div className="text-xs text-gray-500 mb-2">{post.date}</div>
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-400 text-sm">{post.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
