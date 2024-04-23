import { parse, ParsedQs } from 'qs';
import { useMemo } from 'react';
import { useRouter } from 'next/router';

export function parsedQueryString(search?: string): ParsedQs {
  if (!search) {
    const queryParams = useRouter().query;
    const searchParams = new URLSearchParams(queryParams as any).toString();
    search = searchParams.length > 0 ? '?' + searchParams : '';
  }
  return search && search.length > 1 ? parse(search, { parseArrays: false, ignoreQueryPrefix: true }) : {};
}

export default function useParsedQueryString(): ParsedQs {
  const { asPath } = useRouter();
  const search = asPath.includes('?') ? asPath.substring(asPath.indexOf('?')) : undefined;
  return useMemo(() => parsedQueryString(search), [search]);
}
