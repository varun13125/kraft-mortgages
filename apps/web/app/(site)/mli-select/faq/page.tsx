export default function FAQPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-white to-slate-50">
        <div className="container-tight section-pad">
          <div className="max-w-3xl">
            <span className="badge badge-tier">CMHC • MLI Select</span>
            <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-brand-blue">
              Frequently Asked Questions
            </h1>
            <p className="mt-3 text-slate-700">
              Kraft Mortgages • MLI Select
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-tight grid gap-6">
          <div className="card">
            <div className="card-body">
              <div className="prose">
                <p>Common questions and answers about CMHC MLI Select.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}