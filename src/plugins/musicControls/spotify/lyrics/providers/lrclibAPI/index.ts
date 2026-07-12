/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { LyricsData, Provider } from "@plugins/musicControls/spotify/lyrics/providers/types";
import { Track } from "@plugins/musicControls/spotify/SpotifyStore";

const baseUrlLrclib = "https://lrclib.net/api/get";

interface LrcLibResponse {
    id: number;
    name: string;
    trackName: string;
    artistName: string;
    albumName: string;
    duration: number;
    instrumental: boolean;
    plainLyrics: string | null;
    syncedLyrics: string | null;
}

function lyricTimeToSeconds(time: string) {
    const [minutes, seconds] = time.slice(1, -1).split(":").map(Number);
    return minutes * 60 + seconds;
}

export async function getLyricsLrclib(track: Track): Promise<LyricsData | null> {
    const info = {
        track_name: track.name,
        artist_name: track.artists[0]?.name ?? "",
        album_name: track.album?.name ?? "",
        duration: String(track.duration / 1000)
    };

    const params = new URLSearchParams(info);
    const url = `${baseUrlLrclib}?${params.toString()}`;
    const response = await fetch(url, {
        headers: {
            "User-Agent": "SpotifyLyrics for Equicord (https://github.com/Masterjoona/vc-spotifylyrics)"
        }
    });

    let data: LrcLibResponse | null = null;
    if (response.ok) {
        data = await response.json() as LrcLibResponse;
    }

    if (!data || !data.syncedLyrics) {
        // Fallback to search endpoint if exact match failed
        const searchParams = new URLSearchParams({
            track_name: track.name,
            artist_name: track.artists[0]?.name ?? ""
        });
        const searchUrl = `https://lrclib.net/api/search?${searchParams.toString()}`;
        try {
            const searchResponse = await fetch(searchUrl, {
                headers: {
                    "User-Agent": "SpotifyLyrics for Equicord (https://github.com/Masterjoona/vc-spotifylyrics)"
                }
            });
            if (searchResponse.ok) {
                const results = await searchResponse.json() as LrcLibResponse[];
                if (Array.isArray(results) && results.length > 0) {
                    const match = results.find(r => r.syncedLyrics);
                    if (match) {
                        data = match;
                    }
                }
            }
        } catch (e) {
            // ignore search fetch errors
        }
    }

    if (!data || !data.syncedLyrics) return null;

    const lyrics = data.syncedLyrics;
    const lines = lyrics.split("\n").filter(line => line.trim() !== "");

    return {
        useLyric: Provider.Lrclib,
        lyricsVersions: {
            LRCLIB: lines.map(line => {
                const [lrcTime, text] = line.split("]");
                const trimmedText = text.trim();
                return {
                    time: lyricTimeToSeconds(lrcTime),
                    text: (trimmedText === "" || trimmedText === "♪") ? null : trimmedText
                };
            })
        }
    };
}
