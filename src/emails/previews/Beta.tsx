import SendBetaInvite from "../beta/SendInvite";
import ThankYouEmail from "../beta/ThankYou";

export function thankYou() {
  return <ThankYouEmail firstName='Thomas' />;
}

export function sendBetaInvite() {
  return <SendBetaInvite link='' name='Billy' />;
}
