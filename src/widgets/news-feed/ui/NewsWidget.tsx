import { PostsList } from "@/widgets/post";
import styles from "./NewsWidget.module.scss";

export function NewsWidget() {
  return (
    <>
      <h2 className={styles.title}>Лента постов</h2>
      <PostsList />
    </>
  );
}
