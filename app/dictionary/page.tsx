"use client";
import { useState, ChangeEvent, useEffect } from "react";
import { BiBookAlt } from "react-icons/bi";
import { LuSearch } from "react-icons/lu";
import { FaPlay, FaPause } from "react-icons/fa"; // Import play/pause icons
import { options } from "../API/GetMovies";

interface ObjectsSource {
    sourceUrls: string[];
}
export default function HomePage() {
    const [words, setWords] = useState<string>("");
    const [searchResults, setSearchResults] = useState<any | ObjectsSource>({ sourceUrls: [] });
    const [searchMeaning, setSearchMeaning] = useState<any[]>([]);
    const [searchAudio, setSearchAudio] = useState<any[]>([]);
    const [isPlaying, setIsPlaying] = useState<boolean>(false); // State to track play/pause

    const fetchWords = async (words: string) => {
        try {
            const response = await fetch(
                `https://api.dictionaryapi.dev/api/v2/entries/en/${words}`,
                options
            );
            const data = await response.json();

            if (response.ok && data.length > 0) {
                setSearchResults(data[0]);
                setSearchMeaning(data[0]?.meanings || []);
                console.log(data[0] || []);
                setSearchAudio(data[0]?.phonetics || []);
            } else {
                alert("Error: No data found for the given word.");
                setSearchResults(null);
                setSearchMeaning([]);
                setSearchAudio([]);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert(error)
        }
    };

    const handleCapitalizedLetter = (word: string) => {
        if (!word) return "";
        return word[0].toUpperCase() + word.slice(1);
    };

    const capitalizedWord = handleCapitalizedLetter(searchResults?.word);

    const handleSave = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            fetchWords(words);
        }
    };

    useEffect(() => {
        if (words === "" || searchResults === null) {
            setSearchResults(null);
            setSearchMeaning([]);
            setSearchAudio([]);
        }
    }, [words]);



    const togglePlayPause = (audioElement: HTMLAudioElement) => {
        if (isPlaying) {
            audioElement.pause();
        } else {
            audioElement.play();
        }
        setIsPlaying(!isPlaying)
    };


    useEffect(() => {
        const audioElement = document.getElementById(`audio-player`) as HTMLAudioElement;
        const handleAudioEnded = () => {
            setIsPlaying(false);
        };

        if (audioElement) {
            audioElement.addEventListener("ended", handleAudioEnded);
        }

        return () => {
            if (audioElement) {
                audioElement.removeEventListener("ended", handleAudioEnded);
            }
        };
    }, [isPlaying]);


    return (
        <div className="text-black h-screen w-screen pt-[3rem]">
            <div className="flex flex-col gap-4 justify-between w-[51%] mx-auto">
                <div className="flex justify-between items-center">
                    <a href="/"><BiBookAlt className="text-[2.7vw] text-black text-opacity-50 cursor-pointer" /></a>

                    <div className="h-[20%] flex items-center gap-6">
                        <select name="font" id="font-select">
                            <option value="serif">Serif</option>
                            <option value="fantasy">Fantasy</option>
                        </select>
                        <div className="bg-purple-200 w-[1px] h-[20px]"></div>
                    </div>
                </div>
                <div className="py-6 px-8 Text1 h-[3vw] border-0 outline-0 justify-between bg-gray-200 flex items-center rounded-[8px] w-full">
                    <input
                        type="text"
                        value={words}
                        onKeyDown={handleSave}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setWords(e.target.value)
                        }

                        placeholder="Search..."
                        className="w-[80%] border-0 font-bold outline-0 bg-transparent"
                    />
                    <button disabled={words === ""} onClick={() => fetchWords(words)}>
                        <LuSearch className="cursor-pointer text-[1.3vw] text-purple-600" />
                    </button>
                </div>

                <div className="">
                    {searchResults ? (
                        <div className="xl:text-[4vw] flex items-center my-3 justify-between font-black Text1">
                            <div className="flex items-start leading-[3rem] flex-col">
                                <div>{capitalizedWord}</div>
                                <div className="text-[1.5vw] font-normal  text-purple-600">
                                    {searchResults?.phonetic}
                                </div>
                            </div>
                            <div className="text-[1.5vw] font-normal">
                                {searchAudio
                                    .filter((audio: any) => audio.audio)
                                    .slice(0, 1)
                                    .map((audio: any, index: number) => (
                                        <div key={index}>
                                            <audio id={`audio-player`} src={audio.audio}></audio>
                                            <button
                                                className="custom-audio"
                                                onClick={() => {
                                                    const audioElement = document.getElementById(
                                                        `audio-player`
                                                    ) as HTMLAudioElement;
                                                    togglePlayPause(audioElement);
                                                }}
                                            >
                                                {isPlaying ? <FaPause /> : <FaPlay />}
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <button className="text-gray-500 text-center text-sm">
                                No results found
                            </button>
                        </div>
                    )}

                    {searchMeaning.map((meaning: any, index: number) => (
                        <div key={index} className="my-4">
                            <div className="flex items-center  gap-4 my-8">
                                <div className="Text1 text-[1.6vw] "> {meaning.partOfSpeech}</div>
                                <hr className="w-full" />
                            </div>
                            <div className="text-gray-500 mb-4 Text1">Meaning</div>
                            <ul>
                                {meaning.definitions.map((definition: any, i: number) => (
                                    <li key={i}>
                                        {definition.definition}
                                    </li>
                                ))}
                            </ul>
                            <div >
                                <div className="text-gray-500 mb-4 Text1">Synonyms</div>
                                <div className="flex gap-2">
                                    {meaning.synonyms
                                        .slice(0, 3)
                                        .map((synonym: any, i: number) => (
                                            <li key={i}>{synonym}</li>
                                        ))}
                                </div>
                            </div>

                        </div>

                    ))}
                    <div>
                        {
                            searchResults && (<hr />)
                        }
                    </div>

                    <div className="my-8 flex gap-4">
                        <div className="text-gray-500 mb-4 Text1">{searchResults?.sourceUrls && "Source:-"} </div>
                        {
                            searchResults?.sourceUrls?.slice(0,2).map((search: any, index: string | null) => (
                                <div key={index}>
                                    <a href={search} target="_blank" rel="noopener noreferrer" className="text-[1vw]">{search}</a>
                                </div>
                            ))
                        }
                    </div>

                </div>
            </div>
        </div>
    );
}
