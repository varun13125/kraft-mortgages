import Navigation from "@/components/Navigation";

export default function MLISelectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}