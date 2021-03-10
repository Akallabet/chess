import { node } from 'prop-types'

export const Modal = ({ children }) => (
  <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
    {/* <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50" /> */}
    <div className="relative w-auto my-6 mx-auto max-w-3xl">
      {/* <div className="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50">
        <span className="text-sm">X</span>
      </div> */}
      <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none bg-white w-11/12 rounded shadow-lg">
        {children}
      </div>
    </div>
  </div>
)

Modal.propTypes = {
  children: node.isRequired,
}
