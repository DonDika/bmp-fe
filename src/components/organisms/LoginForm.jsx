import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../validations/authSchemas";
import InputField from "../molecules/InputField";
import Button from "../atoms/Button";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { useState } from "react";
import Swal from 'sweetalert2'

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


  const onSubmit = async (data) => {
    try {
      const res = await fetch("${import.meta.env.VITE_API_URL}/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      console.log("Result:", result); 

      if (res.ok && result.token) {
        Cookies.set("token", result.token, { expires: 1 }); // 1 hari

        // alert(result.message); 
        // setMessage("Login berhasil");

        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Signed in successfully"
        });
      
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        setMessage(result.message || "Login gagal.");
      }
    } catch (error) {
      setMessage("Gagal terhubung ke server");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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

      <div className="flex justify-between items-center text-sm text-gray-600">
        <label className="flex items-center space-x-2">
          <input type="checkbox" className="form-checkbox" />
          <span>Remember me</span>
        </label>
        <a href="#" className="text-red-500 hover:underline">
          Forgot password?
        </a>
      </div>

      <Button type="submit">Sign In</Button>
      {message && <p className="text-sm text-center text-red-600">{message}</p>}
    </form>
  );
};

export default LoginForm;
