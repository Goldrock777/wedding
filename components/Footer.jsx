import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-ink/60 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Knot &amp; Co</span>
        <div className="flex gap-4">
          <Link href="/post-wedding" className="hover:text-ink">Post a wedding</Link>
          <Link href="/vendor/join" className="hover:text-ink">Join as vendor</Link>
          <Link href="/about" className="hover:text-ink">About</Link>
        </div>
      </div>
    </footer>
  );
}
