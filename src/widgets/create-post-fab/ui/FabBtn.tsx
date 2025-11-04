import { IconPlus } from "@tabler/icons-react";
import styles from "./FabBtn.module.scss";

function FabBtn() {
  const handleClick = () => {
    // Здесь будет логика создания поста
    console.log("Создать пост");
  };

  return (
    <button className={styles.fabButton} onClick={handleClick}>
      <IconPlus size={28} stroke={2} />
    </button>
  );
}

export default FabBtn;
