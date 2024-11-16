"use client";


import React, { useEffect, useState } from "react";
import MapDisplay from "../components/MapDisplay";

export default function Home() {
	const [posts, setPosts] = useState([]);
	const [lastFetchedData, setLastFetchedData] = useState([]);
	const [dots, setDots] = useState("");

	const fetchPosts = async () => {
		try {
			const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL);
      console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
			const data = await response.json();

			if (JSON.stringify(data) !== JSON.stringify(lastFetchedData)) {
				setPosts(data);
				setLastFetchedData(data);
			}
		} catch (error) {
			console.error("Error fetching posts:", error);
		}
	};

	useEffect(() => {
		fetchPosts();
		const interval = setInterval(fetchPosts, 10000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setDots((prevDots) => (prevDots.length < 3 ? prevDots + "." : ""));
		}, 500);

		return () => clearInterval(interval);
	}, []);

	return (
		<div>
			{posts.length > 0 ? (
				<MapDisplay posts={posts} />
			) : (
				<div className="flex items-center justify-center h-screen bg-gray-100">
					<p className="text-xl font-bold text-gray-700">
						Loading Map<span>{dots}</span>
					</p>
				</div>
			)}
		</div>
	);
}
