import Link from "next/link";
import { SignInButton } from "../SignInButton";
import styles from "./style.module.scss";

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/logo.svg" alt="ig.news" />
        <nav>
          <Link href="/">Home</Link>
          <Link href="/posts">Posts</Link>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
}
