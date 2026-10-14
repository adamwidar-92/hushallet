import { useHousehold } from '@/features/household/HouseholdProvider';
import { PendingRequests } from '@/features/household/PendingRequests';
import { SetupHousehold } from '@/features/household/SetupHousehold';

/** Inloggad utan hushåll: skapa/gå med, eller vänta på godkännande. */
export default function OnboardingScreen() {
  const { pending } = useHousehold();
  return pending.length > 0 ? <PendingRequests /> : <SetupHousehold />;
}
