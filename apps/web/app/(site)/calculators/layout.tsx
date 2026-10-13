import Footer from "@/components/Footer";

// Footer (brokerage name + licence numbers) for every /calculators/* page.
// Deliberately no `metadata` export here: it would cascade onto every calculator
// route. The index page sets its own metadata in page.tsx; each calculator has its own layout.tsx.
export default function CalculatorsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
