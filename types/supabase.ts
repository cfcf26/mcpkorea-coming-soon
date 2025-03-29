export interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
  is_verified: boolean;
  verification_token: string;
  metadata: Record<string, any>;
} 