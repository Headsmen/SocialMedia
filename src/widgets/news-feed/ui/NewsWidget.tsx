import { PostsList } from "@/widgets/posts-list";
import styles from "./NewsWidget.module.scss";

export function NewsWidget() {
  return (
    <>
      <h2 className={styles.title}>Лента постов</h2>
      <PostsList />
    </>
  );
}
