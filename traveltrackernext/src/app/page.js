"use client";

import React, { useEffect, useState } from "react";
import MapDisplay from "../components/MapDisplay";

export default function Home() {
	const [posts, setPosts] = useState([]);
	const [lastFetchedData, setLastFetchedData] = useState([]);
	const [dots, setDots] = useState("");

	// Function to fetch posts
	const fetchPosts = async () => {
		try {
			const response = await fetch("http://127.0.0.1:5001/api/posts");
			const data = await response.json();

			// Only update the state if the data has changed
			if (JSON.stringify(data) !== JSON.stringify(lastFetchedData)) {
				setPosts(data);
				setLastFetchedData(data);
			}
		} catch (error) {
			console.error("Error fetching posts:", error);
		}
	};

	useEffect(() => {
		// Fetch data on component mount
		fetchPosts();

		// Set up an interval to fetch data every 10 seconds
		const interval = setInterval(fetchPosts, 10000);

		// Clear the interval on component unmount
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setDots((prevDots) => (prevDots.length < 3 ? prevDots + "." : ""));
		}, 500);

		return () => clearInterval(interval); // Cleanup interval on unmount
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
