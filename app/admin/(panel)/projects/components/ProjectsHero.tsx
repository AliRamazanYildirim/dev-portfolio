"use client";

interface ProjectsHeroProps {
  onCreateProject: () => void;
}

export function ProjectsHero({ onCreateProject }: ProjectsHeroProps) {
  return (
    <div className="relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:pt-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="text-center lg:text-left">
            <h1 className="title text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-2">
              Admin Panel
            </h1>
            <p className="content text-base sm:text-lg text-white/70">
              Manage your projects
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-3 sm:gap-4">
            <button
              onClick={onCreateProject}
              className="button bg-white text-[#131313] px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 w-full sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2 sm:gap-3 font-bold text-sm sm:text-base">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New Project
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
