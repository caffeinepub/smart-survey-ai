import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useGetForm, useSubmitResponse } from "../hooks/useQueries";

export default function SurveyPage() {
  const { formId } = useParams({ from: "/survey/$formId" });
  const parsedId = BigInt(formId);

  const { data: form, isLoading } = useGetForm(parsedId);
  const submitResponse = useSubmitResponse();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const setAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!form) return;
    const answerPairs: Array<[bigint, string]> = form.questions.map((q) => [
      q.id,
      answers[q.id.toString()] || "",
    ]);

    try {
      await submitResponse.mutateAsync({
        formId: parsedId,
        answers: answerPairs,
      });
      setSubmitted(true);
    } catch {
      toast.error("Failed to submit response. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center px-4">
        <div className="glass-card gradient-border rounded-2xl p-12 text-center max-w-md">
          <h2 className="font-display text-2xl font-bold mb-3">
            Survey Not Found
          </h2>
          <p className="text-muted-foreground">
            This survey does not exist or may have been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-medium mb-4">
            Smart Survey AI
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">{form.title}</h1>
          <p className="text-muted-foreground text-sm">
            {form.questions.length} question
            {form.questions.length !== 1 ? "s" : ""} · Your response is
            anonymous
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              data-ocid="survey.success_state"
              className="glass-card gradient-border rounded-2xl p-12 text-center"
            >
              <CheckCircle2 size={56} className="text-accent mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold mb-3">
                Thank You!
              </h2>
              <p className="text-muted-foreground">
                Your response has been submitted successfully. Your feedback
                helps us improve.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-5"
            >
              {form.questions.map((question, qi) => (
                <motion.div
                  key={question.id.toString()}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: qi * 0.07 }}
                  className="glass-card gradient-border rounded-xl p-6"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <span className="w-7 h-7 rounded-lg bg-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {qi + 1}
                    </span>
                    <p className="font-medium leading-relaxed">
                      {question.questionLabel}
                    </p>
                  </div>

                  {question.questionType.__kind__ === "text" && (
                    <Textarea
                      placeholder="Type your answer here..."
                      value={answers[question.id.toString()] || ""}
                      onChange={(e) =>
                        setAnswer(question.id.toString(), e.target.value)
                      }
                      className="bg-secondary/60 border-border/50 resize-none"
                      rows={3}
                    />
                  )}

                  {question.questionType.__kind__ === "multipleChoice" && (
                    <div className="space-y-2 ml-10">
                      {question.questionType.multipleChoice.map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
                        >
                          <input
                            type="radio"
                            name={`q-${question.id.toString()}`}
                            value={option}
                            checked={answers[question.id.toString()] === option}
                            onChange={() =>
                              setAnswer(question.id.toString(), option)
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                              answers[question.id.toString()] === option
                                ? "border-primary bg-primary"
                                : "border-muted-foreground/50"
                            }`}
                          >
                            {answers[question.id.toString()] === option && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </div>
                          <span className="text-sm">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {question.questionType.__kind__ === "rating_1_5" && (
                    <div className="flex gap-2 ml-10">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          type="button"
                          key={rating}
                          onClick={() =>
                            setAnswer(question.id.toString(), String(rating))
                          }
                          className={`w-12 h-12 rounded-xl border-2 font-display font-bold text-lg transition-all ${
                            answers[question.id.toString()] === String(rating)
                              ? "border-primary bg-primary text-primary-foreground shadow-glow"
                              : "border-border/60 bg-secondary/40 hover:border-primary/50"
                          }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              <Button
                data-ocid="survey.submit_button"
                onClick={handleSubmit}
                disabled={submitResponse.isPending}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow h-12 text-base"
              >
                {submitResponse.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Submitting...
                  </>
                ) : (
                  "Submit Response"
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
