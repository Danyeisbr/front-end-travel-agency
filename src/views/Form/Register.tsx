import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { useHistory, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { registerSchema } from "../../schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showSignup, setShowSignup] = useState(false);
  const history = useHistory();

  const handleCloseSignup = () => {
    setShowSignup(false);
    history.push("/");
  };

  const { signup, errors: registerErrors, isAuthenticated } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: (data: RegisterForm) => Promise<void> = async (data) => {
    await signup(data);
  };

  useEffect(() => {
    if (isAuthenticated) history.push("/hotels");
  }, [isAuthenticated, history]);

  return (
    <>
      <section className="col-12 vh-90 bg-image">
        <div className="col-12 container h-100 d-flex justify-content-center align-items-start">
          <div className="modal d-flex align-items-center justify-content-center custom-modal">
            <div className="modal-dialog modal-dialog-centered modal-lg w-40">
              <div className="modal-content">
                <div className="modal-header bg-primary">
                  <h5 className="modal-title text-white">Sign Up</h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={handleCloseSignup}
                  ></button>
                </div>
                <div className="modal-body">
                  {registerErrors.map((error, i) => (
                    <p className="text-danger" key={i}>
                      {error}
                    </p>
                  ))}

                  <form className="p-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group mb-3">
                      <label htmlFor="username" className="py-2">
                        Username:
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.username ? "is-invalid" : ""
                        }`}
                        placeholder="Write your name"
                        {...register("username")}
                        autoFocus
                      />
                      {errors.username?.message && (
                        <div className="invalid-feedback">
                          {errors.username.message}
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="email" className="py-2">
                        Email:
                      </label>
                      <input
                        type="email"
                        className={`form-control ${
                          errors.email ? "is-invalid" : ""
                        }`}
                        placeholder="Write your email"
                        {...register("email")}
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
                        {...register("password")}
                      />
                      {errors.password?.message && (
                        <div className="invalid-feedback">
                          {errors.password.message}
                        </div>
                      )}
                    </div>
                    <div className="form group mb-3">
                      <label htmlFor="confirmPassword" className="py-2">
                        Confirm Password:
                      </label>
                      <input
                        type="password"
                        className={`form-control ${
                          errors.confirmPassword ? "is-invalid" : ""
                        }`}
                        placeholder="********"
                        {...register("confirmPassword")}
                      />
                      {errors.confirmPassword?.message && (
                        <div className="invalid-feedback">
                          {errors.confirmPassword.message}
                        </div>
                      )}
                    </div>

                    <div className="form group mb-3">
                      <p className="text-center">
                        Already Have an Account?{" "}
                        <Link to="/login" className="text-decoration-none">
                          Login
                        </Link>
                      </p>
                    </div>

                    <div className="row">
                      <div className="col-12">
                        <button
                          type="submit"
                          className="btn btn-primary w-100 mb-3"
                        >
                          Submit
                        </button>
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

export default Register;
