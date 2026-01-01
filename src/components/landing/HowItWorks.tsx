export const HowItWorks = () => {
  return (
    <section className="relative py-32 px-6 overflow-hidden bg-secondary/30">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            From chaos to clarity
            <br />
            <span className="gradient-text">in one click.</span>
          </h2>
        </div>

        {/* Split screen comparison */}
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Left - Messy code */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-3xl opacity-50" />
            <div className="relative p-8 rounded-3xl bg-foreground/[0.03] border border-border overflow-hidden h-full">
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              
              <div className="pt-8 font-mono text-sm">
                <pre className="text-muted-foreground overflow-x-auto">
                  <code>{`// TODO: refactor this mess
function processData(input, callback, options) {
  let result = [];
  for (let i = 0; i < input.length; i++) {
    if (input[i] && input[i].active) {
      const temp = transform(input[i]);
      if (options && options.filter) {
        if (options.filter(temp)) {
          result.push(temp);
        }
      } else {
        result.push(temp);
      }
    }
  }
  // fix this later
  callback(result);
}

// legacy code - don't touch
async function fetchAndProcess() {
  const data = await fetch(url);
  processData(data, (res) => {
    updateUI(res);
  }, { filter: (x) => x.valid });
}`}</code>
                </pre>
              </div>

              {/* Label */}
              <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20">
                <span className="text-sm font-medium text-red-600/80">Before: Complex logic</span>
              </div>
            </div>
          </div>

          {/* Right - Clean diagram */}
          <div className="relative group">
            <div className="absolute inset-0 gradient-bg rounded-3xl opacity-10" />
            <div className="relative p-8 rounded-3xl bg-card border border-border elevated-shadow h-full">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full gradient-bg text-white text-xs font-semibold">
                  Architecture visualized
                </span>
              </div>

              {/* Mermaid-style diagram */}
              <div className="pt-8 flex flex-col items-center justify-center h-[calc(100%-3rem)]">
                <div className="w-full max-w-sm space-y-6">
                  {/* Node 1 */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 p-4 rounded-2xl gradient-bg text-white text-center font-semibold shadow-lg">
                      fetchData()
                    </div>
                  </div>
                  
                  {/* Arrow */}
                  <div className="flex justify-center">
                    <svg className="w-8 h-8 text-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                  </div>

                  {/* Node 2 */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 p-4 rounded-2xl bg-cyan/10 border-2 border-cyan/30 text-cyan text-center font-semibold">
                      transform()
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center">
                    <svg className="w-8 h-8 text-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                  </div>

                  {/* Decision diamond */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 p-4 rounded-2xl bg-teal/10 border-2 border-teal/30 text-teal text-center font-semibold">
                      filter? → updateUI()
                    </div>
                  </div>
                </div>
              </div>

              {/* Label */}
              <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full bg-teal/10 border border-teal/30">
                <span className="text-sm font-medium text-teal">After: Clear flow</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
