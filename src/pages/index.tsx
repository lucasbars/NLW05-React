import { GetStaticProps } from 'next';
import Image from 'next/image';
import { api } from '../services/api';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import styles from './home.module.scss';

interface Episode {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  description: string;
  url: string;
}

type HomeProps = {
  latesEpisodes: Episode[];
  allEpisodes: Episode[];
  // episodes: Array<Episode>
}

export default function Home({ latesEpisodes, allEpisodes }: HomeProps) {
  return (
    <div className={styles.homepage}>
      <section className={styles.latesEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latesEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <Image width= {192} height={192} objectFit="cover" src={episode.thumbnail} alt={episode.title} />

                <div className={styles.episodeDetails}>
                  <a href="">{episode.title}</a>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>
                <button type="button">
                  <img src="/play-green.svg" alt="tocar episódio"/>
                </button>
              </li>
            )
          })}
        </ul>

      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <th></th>
            <th>Podcast</th>
            <th>Integrante</th>
            <th>Data</th>
            <th>Duração</th>
            <th></th>
          </thead>
          <tbody>
            {allEpisodes.map(episode => {
              return (
                <tr key={episode.id} >
                  <td style={{ width: 72 }}> <Image width={120} height={120} src={episode.thumbnail} alt={episode.title} objectFit="cover" /> </td>
                  <td> <a href=""> {episode.title} </a> </td>
                  <td> {episode.members} </td>
                  <td style={{ width: 100 }}> {episode.publishedAt} </td>
                  <td> {episode.durationAsString} </td>
                  <td> <button type="button"> <img src="/play-green.svg" alt="tocar episodio"/> </button> </td>
                </tr>
              )
            })}

          </tbody>

        </table>

      </section>

    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'dd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    };
  });

  const latesEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latesEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
}