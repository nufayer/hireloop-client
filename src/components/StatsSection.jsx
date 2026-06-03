"use client";



const StatsSection = () => {
  const stats = [
    {
      
      value: "50K",
      label: "Active Jobs",
    },
    {
      
      value: "12K",
      label: "Companies",
    },
    {
      
      value: "2M",
      label: "Job Seekers",
    },
    {
      
      value: "97%",
      label: "Satisfaction Rate",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-black py-32">
      {/* Globe Background */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat opacity-80"
        style={{
          backgroundImage: "url('/images/globe.png')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Purple Glow */}
      <div className="absolute left-1/2 top-20 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-violet-600/30 blur-[120px]" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-semibold text-white md:text-5xl">
            Assisting over 15,000 job seekers
          </h2>

          <p className="mt-3 text-xl text-default-400">
            find their dream positions.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-md transition hover:border-violet-500/50"
            >
              <div className="mb-8 text-white/70">
                {item.icon}
              </div>

              <h3 className="text-5xl font-bold text-white">
                {item.value}
              </h3>

              <p className="mt-4 text-default-400">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;