import { createContext, useState, ReactNode, useContext } from 'react';

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

type PlayerContextData = {
  episodeList: Episode[],
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  play: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  setPlayingState: (state: boolean) => void;
  playNext: () => void;
  playPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

type PlayerContextProviderProps = {
  children: ReactNode;
}

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setcurrentEpisodeIndex] = useState(0);
  const [isPlaying, setisPlaying] = useState(false);
  const [isLooping, setisLooping] = useState(false);

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setcurrentEpisodeIndex(0);
    setisPlaying(true);
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list);
    setcurrentEpisodeIndex(index);
    setisPlaying(true);
  }

  function togglePlay() {
    setisPlaying(!isPlaying);
  }

  function toggleLoop() {
    setisLooping(!isLooping);
  }

  function setPlayingState(state: boolean) {
    setisPlaying(state);
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = currentEpisodeIndex + 1 < episodeList.length;

  function playNext() {
      if(hasNext){
      setcurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }

  function playPrevious() {
    if(hasPrevious){
      setcurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  return (
    <PlayerContext.Provider value={{ episodeList, currentEpisodeIndex, play, playList, playNext, playPrevious, isPlaying, isLooping, togglePlay, setPlayingState, hasNext, hasPrevious, toggleLoop  }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer= () => {
  return useContext(PlayerContext);
}