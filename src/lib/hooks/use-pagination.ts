"use client";

import { useState, useMemo } from "react";

interface UsePaginationOptions {
  pageSize?: number;
  initialPage?: number;
}

interface UsePaginationResult {
  page: number;
  pageSize: number;
  offset: number;
  totalPages: number;
  setPage: (page: number) => void;
  setTotal: (total: number) => void;
  next: () => void;
  prev: () => void;
}

export function usePagination({
  pageSize = 10,
  initialPage = 1,
}: UsePaginationOptions = {}): UsePaginationResult {
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(0);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total, pageSize]
  );

  const offset = (page - 1) * pageSize;

  const next = () => setPage((p) => Math.min(p + 1, totalPages));
  const prev = () => setPage((p) => Math.max(p - 1, 1));

  return {
    page,
    pageSize,
    offset,
    totalPages,
    setPage,
    setTotal,
    next,
    prev,
  };
}
