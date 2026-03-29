import React from "react";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";

export function DraggableCardGallery() {
  const items = [
    {
      image: "/compu-fest-images/IMG_0649.webp",
      className: "absolute top-10 left-[20%] rotate-[-5deg]",
    },
    {
      image: "/compu-fest-images/IMG_0650.webp",
      className: "absolute top-40 left-[25%] rotate-[-7deg]",
    },
    {
      image: "/compu-fest-images/IMG_0653.webp",
      className: "absolute top-5 left-[40%] rotate-[8deg]",
    },
    {
      image: "/compu-fest-images/IMG_0654.webp",
      className: "absolute top-32 left-[55%] rotate-[10deg]",
    },
    {
      image: "/compu-fest-images/IMG_0655.webp",
      className: "absolute top-20 right-[35%] rotate-[2deg]",
    },
    {
      image: "/compu-fest-images/IMG_0656.webp",
      className: "absolute top-24 left-[45%] rotate-[-7deg]",
    },
    {
      image: "/compu-fest-images/IMG_0657.webp",
      className: "absolute top-8 left-[30%] rotate-[4deg]",
    },
  ];

  return (
    <DraggableCardContainer className="relative flex min-h-screen w-full items-center justify-center overflow-clip">
      {items.map((item, index) => (
        <DraggableCardBody key={index} className={item.className}>
          <img
            src={item.image}
            alt={`Compufest ${index + 1}`}
            className="pointer-events-none relative z-10 h-80 w-80 object-cover rounded-lg"
          />
        </DraggableCardBody>
      ))}
    </DraggableCardContainer>
  );
}
