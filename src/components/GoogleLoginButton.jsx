import { useEffect } from "react";

const GoogleLoginButton = () => {
  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,

      callback: handleGoogleResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-login"),
      {
        theme: "outline",
        size: "large",
        width: 350,
        text: "signin_with",
      },
    );
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          credential: response.credential,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      // Store your application's JWT
      localStorage.setItem("token", data.token);

      // Store user safely
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Redirect
      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
    }
  };

  return <div id="google-login" className="flex justify-center" />;
};

export default GoogleLoginButton;
