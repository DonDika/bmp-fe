const AuthTemplate = ({ title, subtitle, children, footer }) => (
  <div className="w-screen h-screen flex flex-row">
    <div className="w-full h-full bg-red-500 hidden md:block"></div>
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl p-8 space-y-6 animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        {children}
        {footer && (
          <div className="text-sm text-center text-gray-600">{footer}</div>
        )}
      </div>
    </div>
  </div>
);

export default AuthTemplate;
