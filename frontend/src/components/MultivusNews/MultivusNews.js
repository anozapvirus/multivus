import React, { useState, useEffect } from "react";
import "./MultivusNews.css";

// Ícones SVG
const NewsIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
		<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 14H7v-2h4v2zm0-4H7v-2h4v2zm0-4H7V7h4v2zm6 8h-4V7h4v10z"/>
	</svg>
);

const WeatherIcon = ({ icon }) => (
	<img
		src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
		alt="Weather icon"
		style={{ width: "50px", height: "50px" }}
	/>
);

const ClockIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
		<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-8h4v2h-6V7h2v5z"/>
	</svg>
);

// Componente do Relógio
const Clock = () => {
	const [time, setTime] = useState(new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' }));

	useEffect(() => {
		const interval = setInterval(() => {
			setTime(new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="clock-container">
			<ClockIcon />
			<span>{time}</span>
		</div>
	);
};

// Componente Principal
const MultivusNews = () => {
	const [weather, setWeather] = useState(null);
	const [news, setNews] = useState([]);
	const [error, setError] = useState(null);

	// Busca a previsão do tempo de Santa Juliana, MG
	useEffect(() => {
		const fetchWeather = async () => {
			try {
				const response = await fetch(
					`https://api.openweathermap.org/data/2.5/weather?q=Santa Juliana,BR&units=metric&lang=pt_br&appid=cca6f8acaa2259920bb70baa10b0bbb3`
				);
				const data = await response.json();
				if (data.main) {
					setWeather(data);
				} else {
					setError("Não foi possível carregar a previsão do tempo.");
				}
			} catch (error) {
				console.error("Erro ao buscar previsão do tempo:", error);
				setError("Erro ao carregar a previsão do tempo. Tente novamente mais tarde.");
			}
		};

		fetchWeather();
	}, []);

	// Busca as notícias
	useEffect(() => {
		const fetchNews = async () => {
			try {
				const response = await fetch(
					`https://newsapi.org/v2/top-headlines?country=br&apiKey=ea8efa67302b419eb3582a1379aa5bdd`
				);
				const data = await response.json();
				if (data.articles) {
					setNews(data.articles.slice(0, 5)); // Limita a 5 notícias
				} else {
					setError("Não foi possível carregar as notícias.");
				}
			} catch (error) {
				console.error("Erro ao buscar notícias:", error);
				setError("Erro ao carregar notícias. Tente novamente mais tarde.");
			}
		};

		fetchNews();
	}, []);

	return (
		<div className="multivus-news-container">
			<h2 className="news-header">
				<NewsIcon />
				Notícias em Tempo Real
			</h2>

			{/* Previsão do Tempo */}
			{weather && (
				<div className="weather-container">
					<h3>Clima em Santa Juliana, MG</h3>
					<div className="weather-info">
						<WeatherIcon icon={weather.weather[0].icon} />
						<div>
							<p>Temperatura: {weather.main.temp}°C</p>
							<p>Condição: {weather.weather[0].description}</p>
							<p>Umidade: {weather.main.humidity}%</p>
						</div>
					</div>
				</div>
			)}

			{/* Notícias */}
			{error ? (
				<p className="error-message">{error}</p>
			) : news.length > 0 ? (
				news.map((article, index) => (
					<div key={index} className="news-item">
						<h3 className="news-title">{article.title}</h3>
						<p className="news-description">{article.description}</p>
						<a
							href={article.url}
							target="_blank"
							rel="noopener noreferrer"
							className="news-link"
						>
							Leia mais
						</a>
					</div>
				))
			) : (
				<p>Nenhuma notícia disponível no momento.</p>
			)}

			{/* Relógio */}
			<Clock />
		</div>
	);
};

export default MultivusNews;