"use client";

export default function ErrorAlert({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
      <p className="text-red-700 text-sm font-medium">{children}</p>
    </div>
  );
}
