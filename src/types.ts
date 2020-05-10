export interface Artist {
  external_urls: {
    spotify: string;
  };
  images?: Image[];
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
  genres?: string[];
}

export interface Album {
  album_type: string;
  artists: Artist[];
  available_markets: string[];
  href: string;
  id: string;
  images: Image[];
  name: string;
}

export interface Image {
  height: number;
  width: number;
  url: string;
}

export interface SpotifySong {
  id: string;
  album: Album;
  artists: Artist[];
  available_markets: string[];
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
  href: string;
  name: string;
  popularity: number;
  preview_url: string;
  uri: string;
}

export interface Song {
  voters: string[];
  score: number;
  trackId: string;
  song: SpotifySong
}

export interface Room {
  adminId: string;
  name: string;
  id: string;
  currentSong?: Song;
  vibrantColour: number[]
}

export interface Playlist {
  collaborative: boolean
  description: string
  href: string
  id: string
  images: Image[]
  name: string
  primary_color: string
  snapshot_id: string
  tracks: {
    href: string
    total: number
  }
  type: string
  uri: string
  owner: {
    display_name: string
  }
}