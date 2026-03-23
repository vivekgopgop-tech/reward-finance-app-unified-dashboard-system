import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserProfile, PaymentMethod, PaymentStatus, DepositRequest, UserRole } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserRole'] });
    },
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['currentUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateDepositRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ amount, paymentMethod }: { amount: bigint; paymentMethod: PaymentMethod }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createDepositRequest(amount, paymentMethod);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerDepositRequests'] });
    },
  });
}

export function useGetDepositRequest(requestId: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DepositRequest>({
    queryKey: ['depositRequest', requestId],
    queryFn: async () => {
      if (!actor || !requestId) throw new Error('Actor or requestId not available');
      return actor.getDepositRequest(requestId);
    },
    enabled: !!actor && !actorFetching && !!requestId,
  });
}

export function useSubmitUtr() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, utr }: { requestId: string; utr: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitUtr(requestId, utr);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['depositRequest', variables.requestId] });
      queryClient.invalidateQueries({ queryKey: ['callerDepositRequests'] });
      queryClient.invalidateQueries({ queryKey: ['allDepositRequests'] });
    },
  });
}

export function useGetCallerDepositRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DepositRequest[]>({
    queryKey: ['callerDepositRequests'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerDepositRequests();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllDepositRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DepositRequest[]>({
    queryKey: ['allDepositRequests'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllDepositRequests();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useVerifyPayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, status }: { requestId: string; status: PaymentStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.verifyPayment(requestId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allDepositRequests'] });
      queryClient.invalidateQueries({ queryKey: ['callerDepositRequests'] });
    },
  });
}
