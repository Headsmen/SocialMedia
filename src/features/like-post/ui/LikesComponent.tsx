// LikeButton.tsx
import { IconHeart, IconHeartFilled } from '@tabler/icons-react'
import { useLikeStore } from "@/entities/like/model/LikeStore";
import { Button } from '@mantine/core'
import styles from './LikesComponent.module.scss'

interface LikeButtonProps {
  postId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId }) => {
  const liked = useLikeStore((state) => state.userLikes[postId] || false)
  const toggleLike = useLikeStore((state) => state.toggleLike)

  return (
    <Button
      className={styles.likeButton}
      variant="subtle"
      onClick={() => toggleLike(postId)}
      leftSection={liked ? <IconHeartFilled /> : <IconHeart />}
    >
      {liked ? '' : ''}
    </Button>
  )
}

export default LikeButton