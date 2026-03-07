import Link from "next/link";

const RESOURCES: { subject: string; links: { name: string; href: string }[] }[] = [
  {
    subject: "languages > mandarin",
    links: [
      { name: "ChinesePod", href: "https://chinesepod.com" },
      { name: "The Chairman's Bao", href: "https://thechairmansbao.com" },
      { name: "HSK Online", href: "https://hskonline.com" },
      { name: "Quizlet", href: "https://quizlet.com" },
    ],
  },
  {
    subject: "maths > group theory",
    links: [
      {
        name: "Gallian — Contemporary Abstract Algebra (9th ed.)",
        href: "https://github.com/dtbinh/OpenCourse/blob/master/AbstractAlgebra/Contemporary%20Abstract%20Algebra%209th%20Joseph%20A.%20Gallian.pdf",
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Resources</h1>
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        >
          &larr; back
        </Link>
      </header>

      {RESOURCES.map((section) => (
        <div key={section.subject} className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">{section.subject}</h2>
          <div className="flex flex-wrap gap-3">
            {section.links.map((r) => (
              <a
                key={r.href}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 hover:border-emerald-500 hover:text-emerald-600 transition-colors dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
              >
                {r.name}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
