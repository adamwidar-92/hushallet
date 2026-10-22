import { supabase } from "@/lib/supabase";
import { Avatar } from "@/types/database";
import { useCallback, useState } from "react";

export const useHouseholdAvatars = () => {
  const [takenAvatars, setTakenAvatars] = useState<Avatar[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTakenAvatars = useCallback(async (code: string) => {
    if (!code || code.trim().length === 0) {
      setTakenAvatars([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error: rpcError } = await supabase.rpc("taken_avatars", {
        p_code: code.trim(),
      });

      if (rpcError) throw rpcError;
      setTakenAvatars((data as Avatar[]) || []);
    } catch (err: any) {
      setError(err.message || "Kunde inte hämta upptagna avatarer");
      setTakenAvatars([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getFriendlyErrorMessage = (err: any): string => {
    if (err?.message?.includes("household_members_household_id_avatar_key")) {
      return "Den valda avataren hann tyvärr tas av en annan medlem i hushållet. Välj en annan avatar.";
    }
    return (
      err?.message || "Ett fel uppstod när du försökte gå med i hushållet."
    );
  };

  return {
    takenAvatars,
    loading,
    error,
    fetchTakenAvatars,
    getFriendlyErrorMessage,
  };
};
