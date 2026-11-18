import { BrandLogo } from "@/components/brand-logo"

const POINTS = [
  {
    icon: "fa-chart-line",
    title: "Daily returns",
    desc: "Fixed daily profit on every active plan, credited straight to your wallet.",
  },
  {
    icon: "fa-shield-halved",
    title: "Verified by people",
    desc: "Every deposit and withdrawal is reviewed and approved by our admin team.",
  },
  {
    icon: "fa-bolt",
    title: "Fast local payouts",
    desc: "Withdraw in USDT, or settle through JazzCash and Easypaisa.",
  },
]

export function AuthBrandPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-[#074c2a] text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 30rem 16rem at 90% -10%, rgb(201 162 39 / 0.38), transparent 60%), radial-gradient(ellipse 24rem 18rem at -10% 110%, rgb(255 255 255 / 0.13), transparent 60%), linear-gradient(150deg, #0d7a43 0%, #0a6c3c 48%, #074c2a 100%)",
        }}
      />
      <div className="relative">
        <BrandLogo inverse />
      </div>

      <div className="relative flex flex-col gap-9">
        <div>
          <h2 className="font-heading text-4xl font-bold leading-tight">
            Your money,
            <br />
            growing every day.
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/75">
            Join thousands of investors across Pakistan earning daily returns with flexible plans and secure deposits.
          </p>
        </div>
        <ul className="flex flex-col gap-5">
          {POINTS.map((point) => (
            <li key={point.title} className="flex gap-4">
              <span className="grid h-11 w-11 flex-none place-items-center rounded-xl border border-white/25 bg-white/10 text-base">
                <i className={`fa-solid ${point.icon}`} aria-hidden="true" />
              </span>
              <span>
                <span className="block font-semibold">{point.title}</span>
                <span className="mt-0.5 block max-w-xs text-sm leading-relaxed text-white/70">{point.desc}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative flex gap-10 border-t border-white/15 pt-6">
        <div>
          <p className="font-heading text-2xl font-bold">10K+</p>
          <p className="text-xs text-white/65">Active investors</p>
        </div>
        <div>
          <p className="font-heading text-2xl font-bold">Rs 50M+</p>
          <p className="text-xs text-white/65">Paid out</p>
        </div>
        <div>
          <p className="font-heading text-2xl font-bold">4</p>
          <p className="text-xs text-white/65">USDT networks</p>
        </div>
      </div>
    </div>
  )
}
