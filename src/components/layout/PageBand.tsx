import Link from "next/link";
import styles from "./PageBand.module.css";

interface Crumb {
  label: string;
  href?: string;
}

/** Tinted page-title band with breadcrumb — shared by every page. */
export default function PageBand({
  title,
  crumbs,
}: {
  title: string;
  crumbs: Crumb[];
}) {
  return (
    <header className={styles.band}>
      <div className="container">
        <nav aria-label="Breadcrumb">
          <ol className={styles.breadcrumb}>
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1;
              return (
                <li key={crumb.label} className={styles.crumb}>
                  {crumb.href && !isLast ? (
                    <Link href={crumb.href} className={styles.crumbLink}>
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current={isLast ? "page" : undefined} className={styles.current}>
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && (
                    <svg
                      className={styles.sep}
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m9 5 7 7-7 7" />
                    </svg>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
        <h1 className={styles.title}>{title}</h1>
      </div>
    </header>
  );
}
