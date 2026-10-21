interface SignupFlowState {
  email: string | null;
  verificationToken: string | null;
}

const STORAGE_KEY = "urlens.signup.flow";

const listeners = new Set<() => void>();

function read(): SignupFlowState {
  if (typeof window === "undefined") {
    return { email: null, verificationToken: null };
  }
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { email: null, verificationToken: null };
    return JSON.parse(raw) as SignupFlowState;
  } catch {
    return { email: null, verificationToken: null };
  }
}

let state: SignupFlowState = read();

function write(next: SignupFlowState) {
  state = next;
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  listeners.forEach((listener) => listener());
}

export const signupFlow = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  get: () => state,
  setEmail(email: string) {
    write({ email, verificationToken: null });
  },
  setVerificationToken(verificationToken: string) {
    write({ email: state.email, verificationToken });
  },
  reset() {
    write({ email: null, verificationToken: null });
  },
};
