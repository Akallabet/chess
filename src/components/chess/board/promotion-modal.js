import { Modal, ModalTitle } from '../../modal'
import { ModalBody } from '../../modal/modal-body'
import { withGame } from '../game'
import { Piece } from './piece'

export const PromotionModal = withGame(
  ({ game: { isPromotionModalOpen, promotionPieces, closePromotionModal, activeColor } }) => {
    const handleClick = (SAN) => () => {
      promotionPieces[1](SAN)
      closePromotionModal()
    }
    return isPromotionModalOpen ? (
      <Modal>
        <ModalTitle>Promote to</ModalTitle>
        <ModalBody>
          <div className="flex flex-row w-full">
            {promotionPieces[0].map(({ promotion, SAN }) => (
              <Piece
                key={promotion}
                name={promotion}
                color={activeColor}
                label={`${promotion} ${activeColor} promotion`}
                onClick={handleClick(SAN)}
              />
            ))}
          </div>
        </ModalBody>
      </Modal>
    ) : null
  }
)
