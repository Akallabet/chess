import { node } from 'prop-types'

export const Modal = ({ children }) => (
  <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-gray-50 bg-opacity-50">
    <div className="h-auto p-4 mx-2 text-left bg-white rounded shadow-xl md:max-w-xl md:p-6 lg:p-8 md:mx-0 bg-white">
      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
        <div className="mt-2">{children}</div>
      </div>
      <div className="mt-5 sm:mt-6">
        <span className="flex w-full rounded-md shadow-sm">
          <button className="inline-flex justify-center w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">
            Close this modal!
          </button>
        </span>
      </div>
    </div>
  </div>
)

Modal.propTypes = {
  children: node.isRequired,
}
