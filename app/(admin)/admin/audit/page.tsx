import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";

const AUDIT_LOG = [
  { id: "a1", action: "Shop Verified", target: "Shapla Store", actor: "Admin User", timestamp: "2026-04-02T14:30:00Z", type: "success" },
  { id: "a2", action: "Shop Suspended", target: "Jamal Traders", actor: "Admin User", timestamp: "2026-04-01T16:00:00Z", type: "danger" },
  { id: "a3", action: "Application Received", target: "Karim Bhai Shop", actor: "System", timestamp: "2026-03-28T10:00:00Z", type: "info" },
  { id: "a4", action: "Shop Activated", target: "Fatema Grocery", actor: "Admin User", timestamp: "2025-07-14T11:00:00Z", type: "success" },
  { id: "a5", action: "Shop Verified", target: "Fatema Grocery", actor: "Admin User", timestamp: "2025-07-12T09:30:00Z", type: "success" },
  { id: "a6", action: "Shop Activated", target: "Rahim Store", actor: "Admin User", timestamp: "2025-06-05T10:00:00Z", type: "success" },
  { id: "a7", action: "Shop Verified", target: "Rahim Store", actor: "Admin User", timestamp: "2025-06-03T14:00:00Z", type: "success" },
];

export default function AuditPage() {
  return (
    <div>
      <PageHeader title="Audit Log" description="Platform activity and admin action history" />

      <Card padding="none" className="overflow-hidden">
        <div className="divide-y divide-border">
          {AUDIT_LOG.map((entry) => (
            <div key={entry.id} className="p-4 flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full shrink-0 ${
                entry.type === "success" ? "bg-emerald-500" : entry.type === "danger" ? "bg-red-500" : "bg-blue-500"
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary">
                  <span className="font-medium">{entry.action}</span>
                  {" — "}
                  <span className="text-text-secondary">{entry.target}</span>
                </p>
                <p className="text-xs text-text-tertiary mt-0.5">by {entry.actor}</p>
              </div>
              <span className="text-xs text-text-tertiary whitespace-nowrap">
                {new Date(entry.timestamp).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} {new Date(entry.timestamp).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
