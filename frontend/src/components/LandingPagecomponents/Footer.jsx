import React from "react";
import { AnimatedTooltip } from "./AnimatedTooltip"; // path to your component

export default function TeamFooter() {
  const teammates = [
    {
      id: 1,
      name: "Kirana Trupthi Shree",
      designation: "FullStack Developer",
      image: "https://picsum.photos/200/300",
    },
    {
      id: 2,
      name: "Tejas Philip Thomas",
      designation: "FullStack Developer",
      image: "https://picsum.photos/200/300",
    },
    {
      id: 3,
      name: "Kiesha Maria",
      designation: "FullStack Developer",
      image: "https://picsum.photos/200/300",
    },
    {
      id: 4,
      name: "Nidhish Agarwal",
      designation: "FullStack Developer",
      image: "https://picsum.photos/200/300",
    },
    {
      id: 5,
      name: "Varsha Vijyashwini Panda",
      designation: "FullStack Developer",
      image: "https://picsum.photos/200/300",
    },
  ];

  return (
    <footer className="bg-black p-6 flex justify-center space-x-8">
      <h2 className="text-white text-2xl font-bold tracking-widest">
        THE TEAM
      </h2>
      <AnimatedTooltip items={teammates} />
    </footer>
  );
}
