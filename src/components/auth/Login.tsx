import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { ApiAuth } from "src/api/auth";
import Layout from "src/components/layout/Layout";
import { Credentials } from "src/models/auth";
import { getQueryParams, getUrl } from "src/utils/url";
import { useNavigate } from "react-router-dom";

import "src/styles/auth/login.scss";
import { AuthContext } from "src/contexts/AuthContext";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const params = getQueryParams<{redirect: string}>();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  async function onSubmit(data: Credentials) {
    setIsSubmitting(true);
    const user = (await ApiAuth.login(data)).user;
    setIsSubmitting(false);
    if (auth.setAsLogged) auth.setAsLogged(user);
    if (params.redirect) {
      navigate(params.redirect);
    } else {
      navigate(getUrl("home"));
    }
  }

  return (
    <Layout center>
      <div className="login">
        <h2>Connection</h2>
        <form onSubmit={handleSubmit(onSubmit as any)}>
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur:</label>
            <input
              type="text"
              id="username"
              {...register("username", {
                required: "Le nom d'utilisateur est requis.",
                maxLength: {
                  value: 20,
                  message: "Le nom d'utilisateur ne doit pas dépasser 20 caractères.",
                },
                minLength: {
                  value: 4,
                  message: "Le nom d'utilisateur doit comporter au moins 4 caractères.",
                },
              })}
            />
            {errors.username && (
              <span className="error">{errors.username.message?.toString()}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe:</label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "Le mot de passe est requis.",
                minLength: {
                  value: 6,
                  message: "Le mot de passe doit comporter au moins 6 caractères.",
                },
              })}
            />
            {errors.password && (
              <span className="error">{errors.password.message?.toString()}</span>
            )}
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Envoi en cours..." : "Se connecter"}
          </button>
        </form>
      </div>
    </Layout>
  );
}