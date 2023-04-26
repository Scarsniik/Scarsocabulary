import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { ApiAuth } from "src/api/auth";
import Layout from "src/components/layout/Layout";
import { Credentials } from "src/models/auth";
import { getUrl } from "src/utils/url";
import { useNavigate } from "react-router-dom";

import "src/styles/auth/login.scss";
import { ToastContext } from "src/contexts/ToastContext";
import { ToastType } from "src/models/toast";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const toast = useContext(ToastContext);

  async function onSubmit(data: Credentials) {
    setIsSubmitting(true);
    const sucess = (await ApiAuth.register(data));
    setIsSubmitting(false);
    if (sucess) {
      toast.add({title: "Succes", body: "Votre compte a bien été créé ! Youpi !", type: ToastType.Success});
      navigate(getUrl("login"));
    } else {
      toast.add({title: "Echec", body: "Une erreur s'est produite lors de la creation de compte", type: ToastType.Error});
    }
  }

  return (
    <Layout center>
      <div className="login">
        <h2>Création de Compte</h2>
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
            {isSubmitting ? "Envoi en cours..." : "Créer le compte"}
          </button>
        </form>
      </div>
    </Layout>
  );
}