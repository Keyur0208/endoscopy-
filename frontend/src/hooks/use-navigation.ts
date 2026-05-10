import { useMemo, useState, useEffect } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';

type UseNavigationProps<T> = {
  items: T[];
  currentItem?: T | undefined;
  routeGenerator: (id: number) => string;
  fallbackRoute: string;
  listRouter: string;
  extraItemsCount?: number;
  exitPermissionkey?: string;
};

export function useNavigation<T extends { id: number }>({
  items,
  currentItem,
  routeGenerator,
  fallbackRoute,
  listRouter,
  extraItemsCount = 1,
  exitPermissionkey,
}: UseNavigationProps<T>) {
  const { user } = useAuthContext();
  const router = useRouter();
  const [isDisable, setIsDisable] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [total, setTotal] = useState(1);
  const [isFocus, setIsFocus] = useState(false);
  const [isInputDisable, setInputDisable] = useState(false);
  const [isParticularSearch, setParticularSearch] = useState(false);

  // const sortedItems = useMemo(() => [...items].sort((a, b) => a.id - b.id), [items]);

  const sortedItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return [...items].sort((a, b) => a.id - b.id);
  }, [items]);

  const safeIndex = useMemo(
    () => sortedItems.findIndex((item) => item.id === currentItem?.id),
    [sortedItems, currentItem]
  );

  const isExisting = safeIndex !== -1;

  useEffect(() => {
    const isUpdateFlag = localStorage.getItem('isUpdate');

    if (currentItem && isExisting) {
      const totalCount = items?.length ?? 0;
      setTotal(totalCount);
      setCurrentIndex(safeIndex + 1);

      if (isUpdateFlag === 'true') {
        setIsDisable(false);
      } else {
        setIsDisable(true);
        setInputDisable(true);
        setIsFocus(false);
        setParticularSearch(false);
      }
    } else {
      const totalCount = (items?.length ?? 0) + extraItemsCount;
      setTotal(totalCount);
      setCurrentIndex(totalCount);
      setIsDisable(false);
      setInputDisable(false);
    }
  }, [currentItem, items, isExisting, safeIndex, extraItemsCount]);

  const handleNext = () => {
    if (!items || items.length === 0) return;

    if (safeIndex >= 0 && safeIndex < sortedItems.length - 1) {
      const nextItem = sortedItems[safeIndex + 1];
      router.push(routeGenerator(nextItem.id));
      setIsDisable(true);
      setInputDisable(true);
    } else {
      router.push(fallbackRoute);
      setIsDisable(false);
      setInputDisable(false);
    }
  };

  const handlePrevious = () => {
    if (!items || items.length === 0) return;

    if (!isExisting) {
      const last = sortedItems[sortedItems.length - 1];
      router.push(routeGenerator(last.id));
    } else if (safeIndex > 0) {
      const prev = sortedItems[safeIndex - 1];
      router.push(routeGenerator(prev.id));
    }

    setIsDisable(true);
    setInputDisable(true);
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
    setInputDisable(true);
  };

  const onParticularSearch = () => {
    setIsDisable(false);
    setParticularSearch(true);
    setIsFocus(true);
  };

  const LastReacordItem = useMemo(
    () => (sortedItems.length > 0 ? sortedItems[sortedItems.length - 1] : undefined),
    [sortedItems]
  );

  return {
    currentIndex,
    total,
    isDisable,
    isFocus,
    isInputDisable,
    onhandledisableField,
    isParticularSearch,
    handleNext,
    handlePrevious,
    handleExit,
    handleDisable,
    onParticularSearch,
    LastReacordItem,
  };
}
