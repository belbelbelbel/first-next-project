"use client";
import Link from 'next/link';
import React, { ChangeEvent, useState } from 'react';

export default function HomePage() {
    const [words, setWords] = useState("");
    const [resultData, setResultData] = useState<any[]>([]);
    const items = [1, 2, 3, 4, 5];

    const handleDictionary = async (word: string) => {
        if (word.trim() === "") return; 
        setResultData([]);
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const result = await res.json();
        console.log(result[0]);
        if (Array.isArray(result)) {
            setResultData(result);
        } else {
            console.error("Unexpected response format", result);
        }
    };

    return (
        <div>
            <h1>Welcome to the Home Page</h1>
            <input
                type="text"
                value={words}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setWords(e.target.value)}
                className='border-2'
            />
            <button onClick={() => handleDictionary(words)}>Set Words</button>

            <ul>
                {items.map((item) => (
                    <li key={item}>
                        <Link href={`/result?id=${item}`}>
                            View Item {item}
                        </Link>
                    </li>
                ))}
            </ul>

            <div>
                {resultData.map((data: any, index: number) => (
                    <div key={index}>
                        <div>{data.phonetic}</div>
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    );
}
