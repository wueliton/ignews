import { fauna } from "../../../services/fauna";
import { query as q } from "faunadb";
import { stripe } from "../../../services/stripe";

export const saveSubscription = async (
  subscriptionId: string,
  customerId: string,
  createActions = false
) => {
  const userRef = await fauna.query(
    q.Select(
      "ref",
      q.Get(q.Match(q.Index("user_by_stripe_customer_id"), customerId))
    )
  );

  const { id, status, items } = await stripe.subscriptions.retrieve(
    subscriptionId
  );

  if (createActions) {
    await fauna.query(
      q.Create(q.Collection("subscriptions"), {
        data: {
          id,
          userId: userRef,
          status,
          price_id: items.data[0].price.id,
        },
      })
    );
  } else {
    await fauna.query(
      q.Replace(
        q.Select(
          "ref",
          q.Get(q.Match(q.Index("subscription_by_id"), subscriptionId))
        ),
        {
          data: {
            id,
            userId: userRef,
            status,
            price_id: items.data[0].price.id,
          },
        }
      )
    );
  }
};
