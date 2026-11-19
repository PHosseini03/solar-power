import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface Props {
  eyebrow: string;
  title: ReactNode;
  lead: string;
  image?: string;
}

export function PageHeader({ eyebrow, title, lead, image }: Props) {
  return (
    <section className="relative overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-20">
      {image && <img src={image} alt="" className="absolute inset-0 -z-20 size-full object-cover opacity-25" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/60 via-ink/85 to-ink" />
      <div className="grid-glow absolute inset-0 -z-10" />
      <div className="container-x max-w-3xl text-center">
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="mt-5 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="lead mx-auto mt-5 max-w-2xl">{lead}</p>
        </Reveal>
      </div>
    </section>
  );
}
