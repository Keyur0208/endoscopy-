import type {
  IPaginatedResponseMeta,
  ICurrentPaginatedResponse,
} from 'src/types/pagination-fillter';

import { useRef, useMemo, useState, useEffect } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';

import { useAuthContext } from 'src/auth/hooks';

type UsePaginationProps<T> = {
  items: T[];
  meta?: IPaginatedResponseMeta | undefined;
  currentItem?: T | undefined;
  currentMeta?: ICurrentPaginatedResponse | undefined;
  routeGenerator: (id: number) => string;
  fallbackRoute: string;
  listRouter: string;
  extraItemsCount?: number;
  exitPermissionkey?: string;
  currentisLoading?: boolean;
};

export function usePagination<T extends { id: number }>({
  items,
  meta,
  currentItem,
  currentMeta,
  routeGenerator,
  fallbackRoute,
  listRouter,
  extraItemsCount = 1,
  exitPermissionkey,
  currentisLoading,
}: UsePaginationProps<T>) {
  const { user } = useAuthContext();
  const router = useRouter();
  const [isDisable, setIsDisable] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [total, setTotal] = useState(1);
  const [isFocus, setIsFocus] = useState(false);
  const [isParticularSearch, setParticularSearch] = useState(false);
  const lastPaginationRef = useRef<{
    total: number;
    index: number;
    isDisable: boolean;
  } | null>(null);

  const LastRecordItem = useMemo(
    () => (items?.length > 0 ? items[items.length - 1] : undefined),
    [items]
  );

  useEffect(() => {
    const isUpdateFlag = localStorage.getItem('isUpdate');

    if (currentItem && currentMeta) {
      const value = {
        total: currentMeta.total,
        index: currentMeta.position,
        isDisable: true,
      };

      lastPaginationRef.current = value;

      setTotal(value.total);
      setCurrentIndex(value.index);

      if (isUpdateFlag === 'true') {
        setIsDisable(false);
        setIsFocus(false);
        setParticularSearch(false);
      } else {
        setIsDisable(true);
        setIsFocus(false);
        setParticularSearch(false);
      }
      return;
    }

    // ✅ LIST PAGE pagination
    if (!currentItem && meta) {
      const value = {
        total: meta.total + extraItemsCount || 1,
        index: meta.total + extraItemsCount || 1,
        isDisable: false,
      };

      lastPaginationRef.current = value;

      setTotal(value.total);
      setCurrentIndex(value.index);
      setIsDisable(false);
      setIsFocus(false);
      setParticularSearch(false);
    }
  }, [currentItem, currentMeta, meta, extraItemsCount]);

  const handleNext = () => {
    if (currentMeta) {
      if (currentMeta.nextId && !currentisLoading) {
        router.push(routeGenerator(currentMeta.nextId));
        setIsDisable(true);
        setIsFocus(false);
        return;
      }
      router.push(fallbackRoute);
    } else if (!currentItem) {
      toast.info('No Next Record Found');
      return;
    }
    if (currentisLoading) {
      toast.info('Loading Next Record');
    }
  };

  const handlePrevious = () => {
    if (currentMeta && currentMeta?.prevId && !currentisLoading) {
      router.push(routeGenerator(currentMeta.prevId));
      setTotal(currentMeta.total);
      setCurrentIndex(currentMeta.position);
      setIsDisable(true);
      setIsFocus(false);
      return;
    }
    if (meta && meta.lastId && !currentMeta && !currentisLoading) {
      router.push(routeGenerator(meta.lastId));
      setIsDisable(true);
      setIsFocus(false);
      return;
    }
    if (currentisLoading && !currentMeta?.prevId) {
      toast.info('Loading Previous Record');
      return;
    }
    toast.info('No Previous Record Found');
  };

  // const permissionKeys = [...(user?.policy?.permissions?.map((p: any) => p?.permissionKey) ?? [])];

  // const hasAnyPermission = exitPermissionkey ? permissionKeys.includes(exitPermissionkey) : false;

  const handleExit = () => {
    if (exitPermissionkey || user?.isAdmin) {
      router.push(listRouter);
      return;
    }
    router.push(paths.dashboard.root);
  };

  const handleDisable = () => setIsDisable(false);

  const onhandledisableField = () => {
    setIsDisable(true);
  };

  const onParticularSearch = () => {
    setIsDisable(false);
    setParticularSearch(true);
    setIsFocus(true);
  };

  return {
    currentIndex,
    total,
    isDisable,
    isFocus,
    onhandledisableField,
    isParticularSearch,
    handleNext,
    handlePrevious,
    handleExit,
    handleDisable,
    onParticularSearch,
    LastRecordItem,
  };
}
