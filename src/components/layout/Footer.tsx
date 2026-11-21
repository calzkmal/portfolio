import Link from "next/link";
import { navigation } from "@/data/site";
import { profile } from "@/data/profile";

/** Dark footer: continues the Contact scene on the home page, closes every other page. */
export function Footer() {
  return (
    <footer className="on-ink relative bg-ink text-paper">
      <div className="container grid gap-10 border-t border-paper/10 py-12 md:grid-cols-[1fr_auto]">
        <div>
          <p className="text-small font-semibold">{profile.name}</p>
          <p className="mt-1 text-small text-paper/70">{profile.title}</p>
          <p className="mt-6 font-mono text-meta text-paper/60">
            {profile.location}
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-1 text-small sm:grid-cols-3">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-draw inline-flex min-h-11 items-center text-paper/80 hover:text-paper">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="container pb-8 font-mono text-meta text-paper/50">
        © {new Date().getFullYear()} {profile.name}
      </div>
    </footer>
  );
}
