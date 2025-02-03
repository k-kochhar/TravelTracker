"use client";

import React, { useEffect, useState } from "react";
import MapDisplay from "../components/MapDisplay";

export default function Home() {
	const [posts, setPosts] = useState([]);
	const [lastFetchedData, setLastFetchedData] = useState([]);
	const [dots, setDots] = useState("");
	const [loadingTime, setLoadingTime] = useState(0);

	const fetchPosts = async () => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts`
			);
			console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/posts`);
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

	useEffect(() => {
		const interval = setInterval(() => {
			setLoadingTime((prevTime) => prevTime + 1);
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div>
			{posts.length > 0 ? (
				<MapDisplay posts={posts} />
			) : (
				<div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-blue-100">
					<p className="text-2xl font-semibold text-gray-800">
						Loading Map<span>{dots}</span>
					</p>
          <p className="text-gray-600 mt-10 text-xl font-bold text-center">
						Spinning up the backend
					</p>
					<p className="text-gray-600 mt-2 text-center">
						Estimated time:{" "}
						<span className="font-medium">up to 75 seconds</span>
					</p>
					<p className="text-gray-600 mt-1">
						Elapsed time:{" "}
						<span className="font-semibold">
							{loadingTime} second{loadingTime !== 1 ? "s" : ""}
						</span>
					</p>
				</div>
			)}
		</div>
	);
}
