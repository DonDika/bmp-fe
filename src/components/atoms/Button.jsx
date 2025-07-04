const Button = ({ type = "button", children, ...props }) => (
  <button
    type={type}
    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition duration-300"
    {...props}
  >
    {children}
  </button>
);

export default Button;
