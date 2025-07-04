import AuthTemplate from "../components/templates/AuthTemplate";
import LoginForm from "../components/organisms/LoginForm";

const LoginPage = () => (
  <AuthTemplate
    title="Welcome Back"
    subtitle="Login to your account"
    footer={
      <>
        Don't have an account?{" "}
        <a href="/auth/register" className="text-red-500 hover:underline font-medium">Sign Up</a>
      </>
    }
  >
    <LoginForm />
  </AuthTemplate>
);

export default LoginPage;
