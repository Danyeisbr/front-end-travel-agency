import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../schemas/auth";

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showLogin, setShowLogin] = useState(false);
  const history = useHistory();
  const handleCloseLogin = () => {
    setShowLogin(false);
    history.push("/");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });
  const { signin, errors: loginErrors, isAuthenticated } = useAuth();
  const onSubmit: SubmitHandler<LoginForm> = (data) => {
    signin(data);
  };

  useEffect(() => {
    if (isAuthenticated) {
      history.push("/hotels");
    }
  }, [isAuthenticated, history]);

  return (
    <>
      <section className="col-12 vh-90 bg-image">
        <div className="col-12 container h-100 d-flex justify-content-center align-items-start">
          <div className="modal d-flex align-items-center justify-content-center custom-modal">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-primary">
                  <h5 className="modal-title text-white">Login</h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={handleCloseLogin}
                  ></button>
                </div>
                <div className="modal-body">
                  {loginErrors.map((error, i) => (
                    <p className="text-danger" key={i}>
                      {error}
                    </p>
                  ))}
                  <form className="p-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group mb-3">
                      <label htmlFor="email" className="py-2">
                        Email:
                      </label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        placeholder="Write your email"
                        {...register("email", { required: true })}
                      />
                      {errors.email?.message && (
                        <div className="invalid-feedback">
                          {errors.email.message}
                        </div>
                      )}
                    </div>
                    <div className="form group mb-3">
                      <label htmlFor="password" className="py-2">
                        Password:
                      </label>
                      <input
                        type="password"
                        className={`form-control ${
                          errors.password ? "is-invalid" : ""
                        }`}
                        placeholder="********"
                        {...register("password", {
                          required: true,
                          minLength: 6,
                        })}
                      />
                      {errors.password?.message && (
                        <div className="invalid-feedback">
                          {errors.password.message}
                        </div>
                      )}
                    </div>
                    <div className="col d-flex justify-content-center form-group form-check mb-4">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="exampleCheck1"
                      />
                      <label
                        className="form-check-label mx-1"
                        htmlFor="exampleCheck1"
                      >
                        Remember me
                      </label>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <button className="btn btn-primary mb-3 w-100">
                          Login
                        </button>
                      </div>
                      <div className="col-6">
                        <p className="text-muted">Forgot user?</p>
                      </div>
                      <div className="col-6 text-end">
                        <p className="text-muted">Forgot password?</p>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
