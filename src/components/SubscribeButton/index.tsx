import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe.js";
import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data: session } = useSession();
  const [loadingSubscribe, setLoadingSubscribe] = useState(false);

  const handleSubscribe = async () => {
    if (loadingSubscribe) return;
    if (!session) return signIn("github");

    try {
      setLoadingSubscribe(true);
      const response = await api.post("/subscribe");

      const { sessionId } = response.data;
      const stripe = await getStripeJs();
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      setLoadingSubscribe(false);
      alert(err.message);
    }
  };

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
      disabled={loadingSubscribe}
    >
      Subscribe now
    </button>
  );
}
