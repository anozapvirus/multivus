import React, { useState, useEffect } from "react";

const MultivusNews = () => {
	const [news, setNews] = useState([]);
	const [error, setError] = useState(null);

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
		<div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
			<h2>Notícias em Tempo Real</h2>
			{error ? (
				<p style={{ color: "red" }}>{error}</p>
			) : (
				news.map((article, index) => (
					<div key={index} style={{ marginBottom: "20px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
						<h3>{article.title}</h3>
						<p>{article.description}</p>
						<a href={article.url} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff", textDecoration: "none" }}>
							Leia mais
						</a>
					</div>
				))
			)}
		</div>
	);
};

export default MultivusNews;