import { IconPlus } from "@tabler/icons-react";
import { useFabBtn } from "./useFabBtn";
import styles from "./FabBtn.module.scss";

export const FabBtn = () => {
  const { handleCreatePost } = useFabBtn();

  return (
    <button className={styles.fabButton} onClick={handleCreatePost}>
      <IconPlus size={28} stroke={2} />
    </button>
  );
};
