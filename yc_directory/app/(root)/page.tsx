import SearchForm from "@/components/SearchForm";
import StartupCard from "@/components/StartupCard";
import { STARTUP_QUERY } from "@/sanity/lib/queries";
import { StartupTypeCard } from "@/components/StartupCard";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { auth } from "@/auth";

type Query = {
  searchParams: Promise<{ query?: string }>;
};
export default async function Home({ searchParams }: Query) {
  const query = (await searchParams).query;
  const params = { search: query || null };

  const { data: posts } = await sanityFetch({ query: STARTUP_QUERY, params });

  const session = await auth();

  console.log(session?.id);

  return (
    <>
      <section className="pink_container">
        <h1 className="heading !max-w-3xl">
          Pitch your startups, <br /> Connect with Entrepreneurs
        </h1>
        <p className="sub-heading">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual Competitions
        </p>
        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Startups"}
        </p>

        <ul className="card_grid">
          {posts?.map((post: StartupTypeCard, index: number) => {
            return <StartupCard key={post._id} post={post} />;
          })}
        </ul>
      </section>

      <SanityLive />
    </>
  );
}
