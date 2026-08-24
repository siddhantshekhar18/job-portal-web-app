const statusStyles = {
  pending: "bg-blue-50 text-blue-700 ring-blue-600/20",
  reviewing: "bg-purple-50 text-purple-700 ring-purple-600/20",
  shortlisted: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  accepted: "bg-green-50 text-green-700 ring-green-600/20",
  rejected: "bg-red-50 text-red-700 ring-red-600/20",
};

function StatusBadge({ status, className = "" }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ${statusStyles[status] || statusStyles.pending} ${className}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
