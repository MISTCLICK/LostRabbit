import Loading from "@/app/loading";
import Frame from "@/components/frame";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import "@/app/globals.css";

export default function Level() {
  const [data, setData] = useState<null | Level>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!pathName) return;

    fetch(`/api${pathName}`)
      .then((res) => res.json())
      .then(({ data }) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => {
        router.replace("/404");
      });
  }, [pathName, router]);

  if (isLoading) return <Loading />;
  if (!data) {
    router.replace("/404");
    return <></>;
  }

  return (
    <main>
      <Frame level={data} width={600} height={600} />
    </main>
  );
}
