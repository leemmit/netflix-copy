import styles_S from './MovieContainer_S.module.scss'
import styles_L from './MovieContainer_L.module.scss'
import { useState, useEffect } from 'react'
import { getData } from '../../../server'
import { useNavigate } from 'react-router-dom'
import { scrollToTop } from '../../../server'

const MovieContainer = ({ url, onMovieIdChange }) => {
    const [movies, setMovies] = useState([]);
    const [id, setId] = useState(0)
    const navigate = useNavigate();
    //const styles = useStyleL ? styles_L : styles_S;
    const styles = styles_S;

    useEffect(() => {
        // Создаем асинхронную функцию внутри useEffect
        const fetchMovies = async () => {
            const data = await getData(url);
            setMovies(data.films || data.items); // Сохраняем массив фильмов в состоянии
        };

        fetchMovies(); // Вызываем асинхронную функцию
    }, [url]); // Добавляем url в зависимости, чтобы обновлять данные при изменении URL

    const handleMovieClick = (ID) => {
        if (ID !== 0 && ID !== id){
            setId(ID);
            onMovieIdChange(ID);
            navigate('/movie');
        }
    }

    return (
        <div className={styles.movies}>
            {!movies ? [] : movies.map((movie) => (
                <div 
                key={movie.kinopoiskId || movie.filmId} 
                className={styles.movie}
                onClick={() => {handleMovieClick(movie.kinopoiskId || movie.filmId); scrollToTop()}}
                >
                    <div className={styles.movie_wrapper}>
                        <img
                            src={movie.posterUrl || movie.posterUrlPreview}
                            alt={movie.nameRu || movie.nameOriginal}
                        />
                        <div className={styles.movie_info}>
                            <span className={styles.movie_title}>
                                {movie.nameRu || movie.nameEn || movie.nameOriginal}
                            </span>
                            <span className={styles.movie_category}>
                                {movie.genres.map(genre => genre.genre).join(', ')}
                            </span>
                            {movie.rating === 'null' ? '' : (
                                <span className={styles.movie_rating}>
                                    {movie.ratingKinopoisk || movie.ratingImdb || movie.rating}
                                </span>
                            )}
                            <span className={styles.movie_year}>
                                {movie.year}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MovieContainer;