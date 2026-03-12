import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Download, Inbox, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetForm, useGetFormResponses } from "../hooks/useQueries";

export default function ResponsesPage() {
  const { formId } = useParams({ from: "/forms/$formId/responses" });
  const parsedId = BigInt(formId);
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();

  const { data: form, isLoading: formLoading } = useGetForm(parsedId);
  const { data: responses, isLoading: responsesLoading } =
    useGetFormResponses(parsedId);

  const isLoading = formLoading || responsesLoading;

  if (!identity) {
    return (
      <div className="min-h-screen mesh-bg">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center px-4 pt-16">
          <div className="glass-card gradient-border rounded-2xl p-12 text-center max-w-md">
            <h2 className="font-display text-2xl font-bold mb-3">
              Sign In Required
            </h2>
            <p className="text-muted-foreground mb-6">
              You need to be signed in to view responses.
            </p>
            <Button
              onClick={() => navigate({ to: "/login" })}
              className="bg-primary text-primary-foreground"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const exportToCSV = () => {
    if (!form || !responses || responses.length === 0) {
      toast.error("No data to export.");
      return;
    }

    const headers = [
      "Response #",
      ...form.questions.map((q) => q.questionLabel),
    ];
    const rows = responses.map((resp, i) => {
      const answerMap = new Map(
        resp.answers.map(([qid, ans]) => [qid.toString(), ans]),
      );
      return [
        String(i + 1),
        ...form.questions.map((q) => answerMap.get(q.id.toString()) || ""),
      ];
    });

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.title.replace(/[^a-z0-9]/gi, "_")}_responses.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported to CSV (Excel-compatible)!");
  };

  const getResponseKey = (
    resp: { answers: Array<[bigint, string]>; formId: bigint },
    idx: number,
  ) => {
    const firstAnswer = resp.answers[0]?.[1] ?? "";
    return `${resp.formId.toString()}-${idx}-${firstAnswer.slice(0, 8)}`;
  };

  return (
    <div className="min-h-screen mesh-bg">
      <Navbar />
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: "/forms" })}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={16} className="mr-1" /> Back
            </Button>
            <div>
              <h1 className="font-display text-2xl font-bold">
                {formLoading ? "Loading..." : form?.title || "Survey Responses"}
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                {responses
                  ? `${responses.length} response${responses.length !== 1 ? "s" : ""}`
                  : ""}
              </p>
            </div>
          </div>

          <Button
            data-ocid="responses.export_button"
            onClick={exportToCSV}
            variant="outline"
            className="border-accent/40 text-accent hover:bg-accent/10"
            disabled={!responses || responses.length === 0}
          >
            <Download size={15} className="mr-2" />
            Export to CSV (Excel)
          </Button>
        </motion.div>

        {isLoading ? (
          <div
            data-ocid="responses.loading_state"
            className="flex items-center justify-center py-20"
          >
            <Loader2 className="animate-spin text-primary" size={36} />
          </div>
        ) : !responses || responses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            data-ocid="responses.empty_state"
            className="glass-card gradient-border rounded-2xl p-16 text-center"
          >
            <Inbox size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold mb-2">
              No Responses Yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Share your survey link to start collecting responses.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                const url = `${window.location.origin}/survey/${formId}`;
                navigator.clipboard.writeText(url);
                toast.success("Survey link copied!");
              }}
              className="border-primary/40 text-primary hover:bg-primary/10"
            >
              Copy Survey Link
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card gradient-border rounded-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <Table data-ocid="responses.table">
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-medium w-16">
                      #
                    </TableHead>
                    {form?.questions.map((q) => (
                      <TableHead
                        key={q.id.toString()}
                        className="text-muted-foreground font-medium min-w-40"
                      >
                        {q.questionLabel}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {responses.map((resp, i) => {
                    const answerMap = new Map(
                      resp.answers.map(([qid, ans]) => [qid.toString(), ans]),
                    );
                    return (
                      <TableRow
                        key={getResponseKey(resp, i)}
                        data-ocid={`responses.row.${i + 1}`}
                        className="border-border/30 hover:bg-secondary/30"
                      >
                        <TableCell className="text-muted-foreground font-medium">
                          {i + 1}
                        </TableCell>
                        {form?.questions.map((q) => (
                          <TableCell key={q.id.toString()} className="text-sm">
                            {answerMap.get(q.id.toString()) || (
                              <span className="text-muted-foreground italic">
                                —
                              </span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}
