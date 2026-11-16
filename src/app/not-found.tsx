import { NotFoundContent } from "@/components/layout/not-found-content";
import { Logo } from "@/components/ui/logo";

export default function RootNotFound() {
  return (
    <div className="min-h-dvh">
      <div className="container-page flex h-24 items-center">
        <Logo />
      </div>
      <NotFoundContent />
    </div>
  );
}
