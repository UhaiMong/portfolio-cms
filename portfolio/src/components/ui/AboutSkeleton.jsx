const AboutSkeleton = ({ standalone = true }) => {
  return (
    <section
      className={`px-4 md:px-6 bg-gray-200 dark:bg-gray-900 ${standalone ? "py-14" : "py-7"}`}
    >
      <div className="max-w-6xl mx-auto animate-pulse space-y-8">
        <div className="h-8 bg-gray-300 dark:bg-gray-800 rounded w-48 mx-auto" />
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="h-64 bg-gray-300 dark:bg-gray-800 rounded-2xl" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-3 bg-gray-300 dark:bg-gray-800 rounded"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSkeleton;
