"use server";

import { env } from "@/env";
import { TMDB } from "tmdb-ts";




export async function searchMovies(query: string) {
    const tmdb = new TMDB(env.TMDB_API_READACCESS_TOKEN);
    const movies = await tmdb.search.movies({query})
    console.log(movies);
    return movies.results.splice(0, 5);
}