"use client";

import Image from "next/image";
import ImageUpload from "@/components/ui/ImageUpload";
import { INVOICE_CONSTANTS } from "@/constants/invoice";

interface ProjectFormValues {
  title: string;
  shortDescription: string;
  description: string;
  descriptionDE: string;
  descriptionTR: string;
  techStack: string;
  category: string;
  duration: string;
  isFeatured: boolean;
  gallery: string[];
  activeTab: "en" | "de" | "tr";
}

interface ProjectFormHandlers {
  setTitle: (value: string) => void;
  setShortDescription: (value: string) => void;
  setDescription: (value: string) => void;
  setDescriptionDE: (value: string) => void;
  setDescriptionTR: (value: string) => void;
  setTechStack: (value: string) => void;
  setCategory: (value: string) => void;
  setDuration: (value: string) => void;
  setIsFeatured: (value: boolean) => void;
  setActiveTab: (tab: "en" | "de" | "tr") => void;
  addGalleryImage: (url: string) => void;
  removeGalleryImage: (index: number) => void;
}

interface ProjectFormModalProps {
  visible: boolean;
  editingProject: boolean;
  values: ProjectFormValues;
  handlers: ProjectFormHandlers;
  onCancel: () => void;
  onSubmit: () => void;
}

export function ProjectFormModal({
  visible,
  editingProject,
  values,
  handlers,
  onCancel,
  onSubmit,
}: ProjectFormModalProps) {
  if (!visible) return null;

  const {
    title,
    shortDescription,
    description,
    descriptionDE,
    descriptionTR,
    techStack,
    category,
    duration,
    isFeatured,
    gallery,
    activeTab,
  } = values;

  const {
    setTitle,
    setShortDescription,
    setDescription,
    setDescriptionDE,
    setDescriptionTR,
    setTechStack,
    setCategory,
    setDuration,
    setIsFeatured,
    setActiveTab,
    addGalleryImage,
    removeGalleryImage,
  } = handlers;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="relative backdrop-blur-xl bg-white/95 border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-2xl lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-[#131313] to-[#131313]/90 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="heading text-lg sm:text-xl lg:text-2xl text-white">
                {editingProject ? "Edit Project" : "Add New Project"}
              </h2>
              <p className="content text-white/70 text-xs sm:text-sm mt-1 hidden sm:block">
                Fill in the project information
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 sm:p-3 hover:bg-white/10 rounded-xl transition-all duration-200 group"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white/70 group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-y-auto max-h-[calc(95vh-200px)] sm:max-h-[calc(90vh-180px)]">
          <div className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-[#131313] mb-2 sm:mb-3">
                  Project Title
                </label>
                <input
                  type="text"
                  placeholder="Enter your amazing project name..."
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl text-[#131313] placeholder:text-[#131313]/60 focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content text-sm sm:text-base"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-[#131313] mb-2 sm:mb-3">
                  Short Description
                </label>
                <textarea
                  placeholder="Briefly summarize your project..."
                  value={shortDescription}
                  onChange={(event) => setShortDescription(event.target.value)}
                  rows={3}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl text-[#131313] placeholder:text-[#131313]/60 focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content resize-none text-sm sm:text-base"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-[#131313] mb-3">
                  Detailed Description
                </label>
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab("en")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === "en"
                        ? "bg-[#131313] text-white"
                        : "bg-white/50 text-[#131313] hover:bg-white/80"
                    }`}
                  >
                    🇬🇧 EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("de")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === "de"
                        ? "bg-[#131313] text-white"
                        : "bg-white/50 text-[#131313] hover:bg-white/80"
                    }`}
                  >
                    🇩🇪 DE
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("tr")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === "tr"
                        ? "bg-[#131313] text-white"
                        : "bg-white/50 text-[#131313] hover:bg-white/80"
                    }`}
                  >
                    🇹🇷 TR
                  </button>
                </div>

                {activeTab === "en" && (
                  <textarea
                    placeholder="Provide detailed information about your project (English)..."
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    rows={4}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl text-[#131313] placeholder:text-[#131313]/60 focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content resize-none text-sm sm:text-base"
                  />
                )}

                {activeTab === "de" && (
                  <textarea
                    placeholder="Detaillierte Projektinformationen (Deutsch)..."
                    value={descriptionDE}
                    onChange={(event) => setDescriptionDE(event.target.value)}
                    rows={4}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl text-[#131313] placeholder:text-[#131313]/60 focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content resize-none text-sm sm:text-base"
                  />
                )}

                {activeTab === "tr" && (
                  <textarea
                    placeholder="Proje hakkında detaylı bilgi (Türkçe)..."
                    value={descriptionTR}
                    onChange={(event) => setDescriptionTR(event.target.value)}
                    rows={4}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl text-[#131313] placeholder:text-[#131313]/60 focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content resize-none text-sm sm:text-base"
                  />
                )}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-[#131313] mb-2 sm:mb-3">
                  Technologies
                </label>
                <input
                  type="text"
                  placeholder="React, Next.js, TypeScript (comma separated)"
                  value={techStack}
                  onChange={(event) => setTechStack(event.target.value)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl text-[#131313] placeholder:text-[#131313]/60 focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content text-sm sm:text-base"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-[#131313] mb-2 sm:mb-3">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl text-[#131313] focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content text-sm sm:text-base"
                >
                  <option value="">Select category</option>
                  {INVOICE_CONSTANTS.PROJECT.DEFAULT_CATEGORY.map((entry) => (
                    <option key={entry} value={entry}>
                      {entry}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-[#131313] mb-2 sm:mb-3">
                  Project Duration
                </label>
                <select
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/80 border border-[#131313]/20 rounded-xl text-[#131313] focus:outline-none focus:ring-2 focus:ring-[#131313] focus:border-transparent transition-all duration-200 content text-sm sm:text-base"
                >
                  {INVOICE_CONSTANTS.PROJECT.DEFAULT_DURATION.map((entry) => (
                    <option key={entry} value={entry}>
                      {entry}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-2">
                <label className="flex items-center gap-3 sm:gap-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(event) => setIsFeatured(event.target.checked)}
                    className="w-5 h-5 sm:w-6 sm:h-6 text-[#c9184a] bg-white/80 border-[#131313]/20 rounded focus:ring-[#c9184a] transition-colors"
                  />
                  <span className="text-sm font-semibold text-[#131313] group-hover:text-[#c9184a] transition-colors">
                    Mark as featured project
                  </span>
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#131313] mb-4">
                  Gallery Images
                </label>
                <div className="backdrop-blur-sm bg-white/50 border-2 border-dashed border-[#131313]/30 rounded-2xl p-8 hover:border-[#131313]/50 transition-colors duration-200">
                  <ImageUpload
                    onUpload={(url: string) => addGalleryImage(url)}
                  />
                </div>

                {gallery.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-8">
                    {gallery.map((url, index) => (
                      <div
                        key={`${url}-${index}`}
                        className="relative group/delete"
                      >
                        <Image
                          src={url}
                          alt={`Gallery image ${index + 1}`}
                          width={200}
                          height={150}
                          className="w-full h-32 object-cover rounded-xl border border-[#131313]/20"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg opacity-0 group-hover/delete:opacity-100 transition-all duration-200 hover:scale-110"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#131313]/5 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-t border-[#131313]/10 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end -mt-3">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 border border-[#131313]/30 text-[#131313] rounded-xl font-medium hover:bg-[#131313]/5 transition-all duration-200 text-sm sm:text-base order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-[#131313] hover:bg-[#131313]/90 text-white rounded-xl font-medium shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 text-sm sm:text-base order-1 sm:order-2"
          >
            {editingProject ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
