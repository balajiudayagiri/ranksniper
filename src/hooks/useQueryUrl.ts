// useQueryUrl.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export function useQueryUrl() {
  const router = useRouter();
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    // Get the URL from the query string
    const queryUrl = router.query.url as string | undefined;

    if (queryUrl) {
      setUrl(queryUrl);
    }
  }, [router.query.url]);

  const updateUrl = (newUrl: string) => {
    // Update the URL query string using Next.js router
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, url: newUrl }, // Add or update the URL parameter in query
      },
      undefined,
      { shallow: true }
    );
  };

  return { url, setUrl: updateUrl };
}
