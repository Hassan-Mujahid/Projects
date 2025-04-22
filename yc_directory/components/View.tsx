import { STARTUP_QUERY, STARTUP_QUERY_VIEWS } from "@/sanity/lib/queries";
import Ping from "./Ping";
import { client } from "@/sanity/lib/client";
import { wrtieClient } from "@/sanity/lib/write-client";
import { after } from "next/server";

const View = async ({ id }: { id: string }) => {
  const { views: totalViews } = await client
    .withConfig({ useCdn: false })
    .fetch(STARTUP_QUERY_VIEWS, { id });

  after(
    async () =>
      await wrtieClient
        .patch(id)
        .set({ views: totalViews + 1 })
        .commit()
  );
  return (
    <div className="view-container">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>
      <div className="view-text">
        <span className="font-black">
          {totalViews} {totalViews > 1 ? "views" : "view"}
        </span>
      </div>
    </div>
  );
};

export default View;
