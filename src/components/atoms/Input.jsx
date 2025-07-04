const Input = ({ type, id, placeholder, ...props }) => (
  <input
    type={type}
    id={id}
    placeholder={placeholder}
    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
    {...props}
  />
);

export default Input;
