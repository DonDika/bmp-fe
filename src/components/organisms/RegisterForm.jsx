import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../validations/authSchemas";
import InputField from "../molecules/InputField";
import Button from "../atoms/Button";
import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();


  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert(result.message); 
        setMessage("Register berhasil. Silakan login.");
        setTimeout(() => navigate("/auth/login"), 1500);
      } else {
        setMessage(result.message || "Terjadi kesalahan.");
      }
    } catch (error) {
      setMessage("Gagal terhubung ke server.");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <InputField
        label="Full Name"
        id="name"
        type="text"
        placeholder="John Doe"
        {...register("name")}
        error={errors.name?.message}
      />
      <InputField
        label="Email Address"
        id="email"
        type="email"
        placeholder="you@example.com"
        {...register("email")}
        error={errors.email?.message}
      />
      <InputField
        label="Password"
        id="password"
        type="password"
        placeholder="••••••••"
        {...register("password")}
        error={errors.password?.message}
      />
      <InputField
        label="Confirm Password"
        id="confirm-password"
        type="password"
        placeholder="••••••••"
        {...register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />
      <Button type="submit">Sign Up</Button>
    </form>
  );
};

export default RegisterForm;
