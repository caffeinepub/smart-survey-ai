import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Question, Response, SurveyForm } from "../backend.d";
import { useActor } from "./useActor";

export function useListForms() {
  const { actor, isFetching } = useActor();
  return useQuery<SurveyForm[]>({
    queryKey: ["forms"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listForms();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetForm(formId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<SurveyForm | null>({
    queryKey: ["form", formId?.toString()],
    queryFn: async () => {
      if (!actor || formId === null) return null;
      return actor.getForm(formId);
    },
    enabled: !!actor && !isFetching && formId !== null,
  });
}

export function useGetFormResponses(formId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Response[]>({
    queryKey: ["responses", formId?.toString()],
    queryFn: async () => {
      if (!actor || formId === null) return [];
      return actor.getFormResponses(formId);
    },
    enabled: !!actor && !isFetching && formId !== null,
  });
}

export function useCreateForm() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      questions,
    }: { title: string; questions: Question[] }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createForm(title, questions);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
    },
  });
}

export function useSubmitResponse() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      formId,
      answers,
    }: {
      formId: bigint;
      answers: Array<[bigint, string]>;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitResponse(formId, answers, "public");
    },
  });
}
