import createNew from '../rpc/createNew/client';
import { useRouter } from 'next/router';
import { ZetkinView } from '../components/types';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { viewCreate, viewCreated } from '../store';

export default function useCreateView(
  orgId: number
): (folderId?: number, rows?: number[]) => void {
  const apiClient = useApiClient();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const createView = async (
    folderId = 0,
    rows: number[] = []
  ): Promise<ZetkinView> => {
    dispatch(viewCreate());
    const view = await apiClient.rpc(createNew, {
      folderId,
      orgId,
      rows,
    });
    dispatch(viewCreated(view));
    router.push(`/organize/${view.organization.id}/people/lists/${view.id}`);
    return view;
  };

  return createView;
}
