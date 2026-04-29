export default function Footer() {
  const footerColumns = [
    {
      title: "ThreadLine",
      links: ["About us", "Sustainability", "Press", "Advertising", "Accessibility"],
    },
    {
      title: "Discover",
      links: ["How it works", "Mobile apps", "Infoboard"],
    },
    {
      title: "Help",
      links: ["Help Center", "Selling", "Buying", "Trust and Safety"],
    },
  ];

  const legalLinks = ["Privacy Center", "Cookie Policy", "Cookie Settings", "Terms & Conditions"];

  return (
    <footer className="mt-14 border-t border-slate-200 bg-[#f5f5f6]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 text-sm text-slate-600 sm:grid-cols-3">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="font-medium text-slate-800">{column.title}</p>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="transition hover:text-slate-900">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-5 border-t border-slate-300 pt-4">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
            {legalLinks.map((link) => (
              <a key={link} href="#" className="transition hover:text-slate-700">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-7 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>2026 ThreadLine Market - All rights reserved.</p>
        <p>Developed by Jules Boutin and Joselito Angeles</p>
      </div>
    </footer>
  );
}
