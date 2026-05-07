export default function PalettePage() {
  return (
    <div className="container-main py-3xl space-y-2xl">

      {/* Colors */}
      <section className="space-y-lg">
        <h2 className="text-h2 text-primary-white">Color Tokens</h2>
        <div className="flex flex-wrap gap-lg">

          <div className="space-y-sm">
            <div className="w-32 h-32 bg-primary-black border border-secondary-grey" />
            <p className="text-small text-primary-white">primary-black</p>
            <p className="text-small text-secondary-grey">#000000</p>
          </div>

          <div className="space-y-sm">
            <div className="w-32 h-32 bg-primary-white" />
            <p className="text-small text-primary-white">primary-white</p>
            <p className="text-small text-secondary-grey">#FFFFFF</p>
          </div>

          <div className="space-y-sm">
            <div className="w-32 h-32 bg-accent-gold" />
            <p className="text-small text-primary-white">accent-gold</p>
            <p className="text-small text-secondary-grey">#B8860B</p>
          </div>

          <div className="space-y-sm">
            <div className="w-32 h-32 bg-secondary-grey" />
            <p className="text-small text-primary-white">secondary-grey</p>
            <p className="text-small text-secondary-grey">#A9A9A9</p>
          </div>

        </div>
      </section>

      {/* Spacing */}
      <section className="space-y-lg">
        <h2 className="text-h2 text-primary-white">Spacing Tokens</h2>
        <div className="space-y-md">
          {[
            { name: 'xs', value: '4px', class: 'w-xs' },
            { name: 'sm', value: '8px', class: 'w-sm' },
            { name: 'md', value: '16px', class: 'w-md' },
            { name: 'lg', value: '24px', class: 'w-lg' },
            { name: 'xl', value: '40px', class: 'w-xl' },
            { name: '2xl', value: '64px', class: 'w-2xl' },
            { name: '3xl', value: '96px', class: 'w-3xl' },
          ].map((token) => (
            <div key={token.name} className="flex items-center gap-lg">
              <p className="text-small text-primary-white w-16">{token.name}</p>
              <div className={`${token.class} h-4 bg-accent-gold`} />
              <p className="text-small text-secondary-grey">{token.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Border Radius */}
      <section className="space-y-lg">
        <h2 className="text-h2 text-primary-white">Border Radius Tokens</h2>
        <div className="flex flex-wrap gap-lg">
          {[
            { name: 'sm', value: '4px', class: 'rounded-sm' },
            { name: 'md', value: '8px', class: 'rounded-md' },
            { name: 'lg', value: '16px', class: 'rounded-lg' },
          ].map((token) => (
            <div key={token.name} className="space-y-sm">
              <div
                className={`w-32 h-32 bg-accent-gold ${token.class}`}
              />
              <p className="text-small text-primary-white">rounded-{token.name}</p>
              <p className="text-small text-secondary-grey">{token.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Container Max Width */}
      <section className="space-y-lg">
        <h2 className="text-h2 text-primary-white">Container</h2>
        <div className="w-full max-w-container border border-accent-gold h-16 
             flex items-center justify-center">
          <p className="text-small text-accent-gold">
            max-w-container — 1280px
          </p>
        </div>
      </section>

    </div>
  )
}