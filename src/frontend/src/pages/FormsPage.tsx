import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, FileText, Loader2, Plus, Share2, Trash2, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Question, QuestionType } from "../backend.d";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCreateForm, useListForms } from "../hooks/useQueries";

type QuestionKind = "text" | "multipleChoice" | "rating_1_5";

let _qId = 0;
const nextQId = () => ++_qId;

interface DraftQuestion {
  qid: number;
  label: string;
  kind: QuestionKind;
  choices: Array<{ cid: number; value: string }>;
}

function buildQuestionType(
  kind: QuestionKind,
  choices: string[],
): QuestionType {
  if (kind === "multipleChoice")
    return {
      __kind__: "multipleChoice",
      multipleChoice: choices.filter(Boolean),
    };
  if (kind === "rating_1_5")
    return { __kind__: "rating_1_5", rating_1_5: null };
  return { __kind__: "text", text: null };
}

export default function FormsPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: forms, isLoading } = useListForms();
  const createForm = useCreateForm();

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<DraftQuestion[]>([
    {
      qid: nextQId(),
      label: "",
      kind: "text",
      choices: [
        { cid: 1, value: "Option A" },
        { cid: 2, value: "Option B" },
      ],
    },
  ]);

  if (!identity) {
    return (
      <div className="min-h-screen mesh-bg">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center px-4 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card gradient-border rounded-3xl p-12 text-center max-w-md"
          >
            <FileText size={48} className="text-primary mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold mb-3">
              Sign In Required
            </h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to access your surveys and create new forms.
            </p>
            <Button
              onClick={() => navigate({ to: "/login" })}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Sign In
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        qid: nextQId(),
        label: "",
        kind: "text",
        choices: [
          { cid: 1, value: "Option A" },
          { cid: 2, value: "Option B" },
        ],
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: Partial<DraftQuestion>) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, ...field } : q)),
    );
  };

  const addChoice = (qIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              choices: [
                ...q.choices,
                {
                  cid: nextQId(),
                  value: `Option ${String.fromCharCode(65 + q.choices.length)}`,
                },
              ],
            }
          : q,
      ),
    );
  };

  const updateChoice = (qIndex: number, cIndex: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              choices: q.choices.map((ch, ci) =>
                ci === cIndex ? { ...ch, value } : ch,
              ),
            }
          : q,
      ),
    );
  };

  const removeChoice = (qIndex: number, cIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? { ...q, choices: q.choices.filter((_ch, ci) => ci !== cIndex) }
          : q,
      ),
    );
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please enter a survey title.");
      return;
    }
    if (questions.some((q) => !q.label.trim())) {
      toast.error("All questions need a label.");
      return;
    }

    const builtQuestions: Question[] = questions.map((q, i) => ({
      id: BigInt(i),
      questionLabel: q.label,
      questionType: buildQuestionType(
        q.kind,
        q.choices.map((ch) => ch.value),
      ),
    }));

    try {
      await createForm.mutateAsync({ title, questions: builtQuestions });
      toast.success("Survey created successfully!");
      setIsOpen(false);
      setTitle("");
      setQuestions([
        {
          qid: nextQId(),
          label: "",
          kind: "text",
          choices: [
            { cid: 1, value: "Option A" },
            { cid: 2, value: "Option B" },
          ],
        },
      ]);
    } catch {
      toast.error("Failed to create survey. Please try again.");
    }
  };

  const handleShare = (formId: bigint) => {
    const url = `${window.location.origin}/survey/${formId.toString()}`;
    navigator.clipboard.writeText(url);
    toast.success("Survey link copied to clipboard!");
  };

  return (
    <div className="min-h-screen mesh-bg">
      <Navbar />
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
        >
          <div>
            <h1 className="font-display text-3xl font-bold">My Surveys</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your feedback surveys
            </p>
          </div>
          <Button
            data-ocid="forms.create_button"
            onClick={() => setIsOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow"
          >
            <Plus size={16} className="mr-2" />
            Create New Survey
          </Button>
        </motion.div>

        {isLoading ? (
          <div
            data-ocid="forms.loading_state"
            className="flex items-center justify-center py-20"
          >
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : !forms || forms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            data-ocid="forms.empty_state"
            className="glass-card gradient-border rounded-2xl p-16 text-center"
          >
            <FileText
              size={48}
              className="text-muted-foreground mx-auto mb-4"
            />
            <h3 className="font-display text-xl font-semibold mb-2">
              No Surveys Yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Create your first survey to start collecting feedback.
            </p>
            <Button
              onClick={() => setIsOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus size={16} className="mr-2" /> Create Survey
            </Button>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {forms.map((form, i) => (
              <motion.div
                key={form.id.toString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                data-ocid={`forms.form.item.${i + 1}`}
                className="glass-card gradient-border rounded-2xl p-6 hover:bg-card/60 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                    <FileText size={18} className="text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {form.questions.length} question
                    {form.questions.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
                <h3 className="font-display font-semibold text-lg mb-1 truncate">
                  {form.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  ID: {form.id.toString()}
                </p>
                <div className="flex gap-2">
                  <Link
                    to="/forms/$formId/responses"
                    params={{ formId: form.id.toString() }}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      data-ocid={`forms.responses_button.${i + 1}`}
                      className="w-full border-border/60 hover:bg-secondary text-xs"
                    >
                      <Eye size={13} className="mr-1" /> Responses
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    data-ocid={`forms.share_button.${i + 1}`}
                    onClick={() => handleShare(form.id)}
                    className="border-accent/40 text-accent hover:bg-accent/10 text-xs"
                  >
                    <Share2 size={13} className="mr-1" /> Share
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Create Form Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          data-ocid="form_builder.dialog"
          className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Create New Survey
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-2">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="form-title">Survey Title</Label>
              <Input
                id="form-title"
                data-ocid="form_builder.title_input"
                placeholder="e.g., Monthly Employee Satisfaction Survey"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>

            {/* Questions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Questions</Label>
                <span className="text-xs text-muted-foreground">
                  {questions.length} question{questions.length !== 1 ? "s" : ""}
                </span>
              </div>

              {questions.map((q, qi) => (
                <div
                  key={q.qid}
                  className="rounded-xl border border-border/60 bg-secondary/30 p-4 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-medium w-6">
                      Q{qi + 1}
                    </span>
                    <Input
                      placeholder="Question label..."
                      value={q.label}
                      onChange={(e) =>
                        updateQuestion(qi, { label: e.target.value })
                      }
                      className="flex-1 bg-background/50 border-border/50 text-sm"
                    />
                    <Select
                      value={q.kind}
                      onValueChange={(val) =>
                        updateQuestion(qi, { kind: val as QuestionKind })
                      }
                    >
                      <SelectTrigger
                        data-ocid={`form_builder.question_type_select.${qi + 1}`}
                        className="w-36 bg-background/50 border-border/50 text-xs"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="multipleChoice">
                          Multiple Choice
                        </SelectItem>
                        <SelectItem value="rating_1_5">Rating 1-5</SelectItem>
                      </SelectContent>
                    </Select>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qi)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  {q.kind === "multipleChoice" && (
                    <div className="ml-8 space-y-2">
                      {q.choices.map((choice, ci) => (
                        <div
                          key={choice.cid}
                          className="flex items-center gap-2"
                        >
                          <div className="w-3 h-3 rounded-full border border-muted-foreground/50 shrink-0" />
                          <Input
                            value={choice.value}
                            onChange={(e) =>
                              updateChoice(qi, ci, e.target.value)
                            }
                            className="flex-1 bg-background/50 border-border/50 text-xs h-8"
                          />
                          {q.choices.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeChoice(qi, ci)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addChoice(qi)}
                        className="text-xs text-accent hover:text-accent/80 flex items-center gap-1 mt-1"
                      >
                        <Plus size={12} /> Add option
                      </button>
                    </div>
                  )}

                  {q.kind === "rating_1_5" && (
                    <div className="ml-8 flex gap-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <div
                          key={n}
                          className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-xs text-primary font-medium"
                        >
                          {n}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                data-ocid="form_builder.add_question_button"
                onClick={addQuestion}
                className="w-full border-dashed border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                <Plus size={14} className="mr-2" /> Add Question
              </Button>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              data-ocid="form_builder.cancel_button"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="form_builder.save_button"
              onClick={handleSave}
              disabled={createForm.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {createForm.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Survey"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
