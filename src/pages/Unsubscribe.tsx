import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

type State =
  | { kind: "loading" }
  | { kind: "valid" }
  | { kind: "already" }
  | { kind: "invalid" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    if (!token) {
      setState({ kind: "invalid" });
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_ANON_KEY } },
        );
        const data = await res.json();
        if (data?.valid === true) setState({ kind: "valid" });
        else if (data?.reason === "already_unsubscribed") setState({ kind: "already" });
        else setState({ kind: "invalid" });
      } catch {
        setState({ kind: "invalid" });
      }
    })();
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setState({ kind: "submitting" });
    try {
      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe`,
        {
          method: "POST",
          headers: { apikey: SUPABASE_ANON_KEY, "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        },
      );
      const data = await res.json();
      if (data?.success) setState({ kind: "success" });
      else if (data?.reason === "already_unsubscribed") setState({ kind: "already" });
      else setState({ kind: "error", message: data?.error ?? "Could not unsubscribe." });
    } catch (e) {
      setState({ kind: "error", message: e instanceof Error ? e.message : "Network error" });
    }
  };

  return (
    <main className="section-padding py-24">
      <div className="container-wide max-w-xl">
        <div className="bg-card border border-border rounded-2xl p-10 text-center">
          <h1 className="font-serif text-3xl text-foreground mb-4">Email preferences</h1>

          {state.kind === "loading" && (
            <p className="body-sm text-muted-foreground">Checking your link...</p>
          )}

          {state.kind === "valid" && (
            <>
              <p className="body-sm text-muted-foreground mb-6">
                Click below to unsubscribe from PsyComply emails.
              </p>
              <Button
                onClick={confirm}
                size="lg"
                className="bg-gold text-gold-foreground hover:bg-gold-hover font-sans"
              >
                Confirm unsubscribe
              </Button>
            </>
          )}

          {state.kind === "submitting" && (
            <p className="body-sm text-muted-foreground">Unsubscribing...</p>
          )}

          {state.kind === "success" && (
            <p className="body-sm text-foreground">
              You've been unsubscribed. We're sorry to see you go.
            </p>
          )}

          {state.kind === "already" && (
            <p className="body-sm text-foreground">You're already unsubscribed.</p>
          )}

          {state.kind === "invalid" && (
            <p className="body-sm text-muted-foreground">
              This unsubscribe link is invalid or has expired.
            </p>
          )}

          {state.kind === "error" && (
            <p className="body-sm text-destructive">{state.message}</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default Unsubscribe;