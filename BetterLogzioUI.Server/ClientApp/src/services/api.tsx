import React from "react";
import { useToken } from "./auth";

export function useSearch() {
  const token = useToken();

  return React.useCallback(
    async function search(timeRange: string = "now-15m"): Promise<SearchResponse> {
      const response = await fetch("/api/v1/search", {
        method: "POST",
        headers: {
          "X-API-TOKEN": token ?? "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          size: 0,
          sort: [{ "@timestamp": "desc" }],
          aggs: {
            type: {
              terms: {
                field: "type",
                size: 50,
              },
            },
            level: {
              terms: {
                field: "level",
                size: 50,
              },
            },
          },
          query: {
            bool: {
              must: [
                {
                  range: {
                    "@timestamp": {
                      gte: timeRange,
                      lte: "now",
                    },
                  },
                },
              ],
            },
          },
        }),
      });

      return (await response.json()) as SearchResponse;
    },
    [token]
  );
}

export function useScroll() {
  const token = useToken();

  const loadInitialData = React.useCallback(
    async function loadInitialData(
      timeRange: string = "now-15m",
      filters: Filters = {}
    ): Promise<ScrollResponse> {
      const filterES = [];
      if (filters.type && filters.type.length > 0) {
        filterES.push({
          terms: {
            type: [...filters.type],
          },
        });
      }
      if (filters.level && filters.level.length > 0) {
        filterES.push({
          terms: {
            level: [...filters.level],
          },
        });
      }

      const response = await fetch("/api/v1/scroll", {
        method: "POST",
        headers: {
          "X-API-TOKEN": token ?? "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          size: 100,
          sort: [{ "@timestamp": "desc" }],
          query: {
            bool: {
              must: [
                {
                  range: {
                    "@timestamp": {
                      gte: timeRange,
                      lte: "now",
                    },
                  },
                },
                ...filterES,
              ],
            },
          },
        }),
      });

      return (await response.json()) as ScrollResponse;
    },
    [token]
  );

  const loadScrollData = React.useCallback(
    async function loadScrollData(scrollId: string): Promise<ScrollResponse> {
      const response = await fetch("/api/v1/scroll", {
        method: "POST",
        headers: {
          "X-API-TOKEN": token ?? "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scroll_id: scrollId,
        }),
      });

      return (await response.json()) as ScrollResponse;
    },
    [token]
  );

  return React.useCallback(
    async function query(timeRange: string | undefined, filters: Filters, scrollId?: string) {
      if (scrollId) {
        return createResult(await loadScrollData(scrollId));
      } else {
        const response = await loadInitialData(timeRange, filters);
        return createResult(response);
      }
    },
    [token, loadScrollData, loadInitialData]
  );
}

function createResult(response: ScrollResponse): QueryResult {
  const { scrollId } = response;
  const { total, hits } = JSON.parse(response.hits);

  return {
    scrollId,
    total,
    hits: hits as any[],
  };
}

export interface QueryResult {
  scrollId: string;
  total: number;
  hits: any[];
}

interface ScrollResponse {
  code: Number;
  scrollId: string;
  hits: string;
}

interface SearchResponse {
  aggregations: Record<
    string,
    {
      buckets: { key: string; doc_count: number }[];
    }
  >;
}

interface AggResult {}

interface Filters {
  type?: string[];
  level?: string[];
}
