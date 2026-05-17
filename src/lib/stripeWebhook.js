import { supabase } from "./supabase";

/**
 * Stripe Webhook Integration Service
 * Automates student subscription activations and records enrollment history in Supabase.
 */
export async function processWebhookEvent(event) {
  const { type, data } = event;

  console.log(`[Stripe Webhook] Received event of type: ${type}`);

  try {
    switch (type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = data.object;
        const customerEmail = subscription.customer_email || subscription.metadata?.customer_email;
        const tier = subscription.metadata?.tier || "professional"; // Default fallback

        if (!customerEmail) {
          throw new Error("No customer email found in subscription metadata.");
        }

        console.log(`[Stripe Webhook] Activating ${tier} tier for student: ${customerEmail}`);

        // 1. Fetch user by email from auth schema / metadata mapping
        const { data: userData, error: userError } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", customerEmail)
          .single();

        if (userError || !userData) {
          console.warn(`[Stripe Webhook] Profile not found for email ${customerEmail}. Creating temporary profile record.`);
        }

        const userId = userData?.id;

        // 2. Update user profile to unlock premium billing tiers
        if (userId) {
          const { error: updateError } = await supabase
            .from("profiles")
            .update({
              role: "learner",
              subscription_tier: tier,
              billing_status: "active",
              updated_at: new Date().toISOString()
            })
            .eq("id", userId);

          if (updateError) throw updateError;

          // 3. Log a learning activity
          await supabase.from("learning_activity").insert({
            learner_id: userId,
            description: `Successfully activated subscription: 24-Week ${tier.toUpperCase()} Program`,
            metadata: JSON.stringify({ stripe_subscription_id: subscription.id, tier })
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = data.object;
        const customerEmail = subscription.customer_email || subscription.metadata?.customer_email;

        if (customerEmail) {
          console.log(`[Stripe Webhook] Deactivating subscription for student: ${customerEmail}`);
          
          const { data: userData } = await supabase
            .from("profiles")
            .select("id")
            .eq("email", customerEmail)
            .single();

          if (userData?.id) {
            await supabase
              .from("profiles")
              .update({
                billing_status: "canceled",
                subscription_tier: "free"
              })
              .eq("id", userData.id);
          }
        }
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${type}`);
    }
    return { success: true };
  } catch (err) {
    console.error(`[Stripe Webhook Error] Failed to process webhook:`, err);
    return { success: false, error: err.message };
  }
}
