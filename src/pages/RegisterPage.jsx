import AuthTemplate from "../components/templates/AuthTemplate";
import RegisterForm from "../components/organisms/RegisterForm";

const RegisterPage = () => (
  <AuthTemplate
    title="Create Account"
    subtitle="Sign up to get started"
    footer={
      <>
        Already have an account?{" "}
        <a
          href="/auth/login"
          className="text-red-500 hover:underline font-medium"
        >
          Sign In
        </a>
      </>
    }
  >
    <RegisterForm />
  </AuthTemplate>
);

export default RegisterPage;
