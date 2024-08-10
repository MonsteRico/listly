"use server";

import { env } from "@/env";
import { TMDB } from "tmdb-ts";




export async function searchTvShows(query: string) {
    const tmdb = new TMDB(env.TMDB_API_READACCESS_TOKEN);
    const tvShows = await tmdb.search.tvShows({query})
    console.log(tvShows);
    return tvShows.results.splice(0, 5);
}