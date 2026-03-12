import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Message, Session } from "../backend.d";
import { useActor } from "./useActor";

export function useListSessions() {
  const { actor, isFetching } = useActor();
  return useQuery<Session[]>({
    queryKey: ["sessions"],
    queryFn: async () => {
      if (!actor) return [];
      const sessions = await actor.listSessions();
      return [...sessions].sort(
        (a, b) => Number(b.createdAt) - Number(a.createdAt),
      );
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMessages(sessionId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Message[]>({
    queryKey: ["messages", sessionId?.toString()],
    queryFn: async () => {
      if (!actor || sessionId === null) return [];
      const msgs = await actor.getMessagesBySession(sessionId);
      return [...msgs].sort(
        (a, b) => Number(a.timestamp) - Number(b.timestamp),
      );
    },
    enabled: !!actor && !isFetching && sessionId !== null,
  });
}

export function useCreateSession() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation<Session, Error, string>({
    mutationFn: (title: string) => {
      if (!actor) throw new Error("No actor");
      return actor.createSession(title);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sessions"] }),
  });
}

export function useDeleteSession() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteSession(sessionId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sessions"] }),
  });
}

export function useAddMessage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      sessionId,
      role,
      content,
    }: {
      sessionId: bigint;
      role: string;
      content: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addMessage(sessionId, role, content);
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({
        queryKey: ["messages", vars.sessionId.toString()],
      });
    },
  });
}
