import { Modal, ModalTitle } from '../../modal'
import { ModalBody } from '../../modal/modal-body'
import { withGame } from '../game'
import { Piece } from './piece'

export const PromotionModal = withGame(
  ({ game: { isPromotionModalOpen, promotionPieces, closePromotionModal, activeColor } }) => {
    // console.log(promotionPieces)
    return isPromotionModalOpen ? (
      <Modal>
        <ModalTitle>Promote to</ModalTitle>
        <ModalBody>
          {promotionPieces.map(({ promotion }) => (
            <Piece
              key={promotion}
              name={promotion}
              color={activeColor}
              label={`${promotion} ${activeColor} promotion`}
              onClick={closePromotionModal}
            />
          ))}
        </ModalBody>
      </Modal>
    ) : null
  }
)
