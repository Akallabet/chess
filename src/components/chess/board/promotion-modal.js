import { Modal } from '../../modal'
import { withGame } from '../game'

export const PromotionModal = withGame(({ game: { isPromotionModalOpen } }) => {
  return isPromotionModalOpen ? (
    <Modal>
      <h4>Promote to</h4>
    </Modal>
  ) : null
})
