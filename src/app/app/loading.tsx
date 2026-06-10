import { Container } from "@/components/ui/container";

function Block({ className = "" }: { className?: string }) {
  return <div className={`bg-forge-800 animate-pulse rounded-xl ${className}`} />;
}

export default function AppLoading() {
  return (
    <Container className="space-y-8" aria-hidden>
      <div className="space-y-2">
        <Block className="h-3 w-24 rounded" />
        <Block className="h-9 w-64 rounded" />
      </div>
      <Block className="h-20" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Block className="h-28" />
        <Block className="h-28" />
        <Block className="h-28" />
        <Block className="h-28" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Block className="h-56" />
        <Block className="h-56" />
      </div>
    </Container>
  );
}
